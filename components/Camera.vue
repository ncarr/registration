<template>
  <div>
    <video playsinline ref="video"></video>
    <v-btn flat icon v-if="multiple" @click="switchCamera"><v-icon>switch_camera</v-icon></v-btn>
    <v-btn flat icon v-if="flashCapable" @click="flash = !flash"><v-icon>flash_on</v-icon></v-btn>
  </div>
</template>

<script>
import localforage from 'localforage'

export default {
  data: () => ({
    track: null,
    camera: null,
    canvas: null,
    flash: false,
    multiple: true,
    flashCapable: true
  }),
  async mounted () {
    this.multiple = (await navigator.mediaDevices.enumerateDevices())
      .filter(d => d.kind === 'videoinput')
      .length > 1
    const camera = await localforage.getItem('camera')
    if (camera) {
      this.start({
        audio: false,
        video: {
          width: 720,
          deviceId: camera
        }
      })
    } else {
      this.start({
        audio: false,
        video: {
          width: 720,
          facingMode: 'environment'
        }
      })
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.track.stop()
      } else if (camera) {
        this.start({
          audio: false,
          video: {
            width: 720,
            deviceId: camera
          }
        })
      } else {
        this.start({
          audio: false,
          video: {
            width: 720,
            facingMode: 'environment'
          }
        })
      }
    })
  },
  methods: {
    async start (constraints) {
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      const video = this.$refs.video
      video.srcObject = stream
      video.play()

      const [track] = stream.getVideoTracks()
      this.track = track
      this.camera = track.getSettings().deviceId
      this.flashCapable = track.getCapabilities().torch
      localforage.setItem('camera', this.camera)

      this.canvas = document.createElement('canvas')
      this.canvas.hidden = true
      this.canvas.width = track.getSettings().width
      this.canvas.height = track.getSettings().height

      requestAnimationFrame(() => this.tick(15))
    },
    async tick (frame) {
      const { getReader } = require('kxing')
      if (frame === 15) {
        const context = this.canvas.getContext('2d')
        context.drawImage(this.$refs.video, 0, 0)
        const imageData = context.getImageData(0, 0, this.canvas.width, this.canvas.height)
        let code
        try {
          code = getReader().decode(imageData)
        } catch (e) {}
        if (code) {
          this.$emit('input', code.text)
        }
        requestAnimationFrame(() => this.tick(1))
      } else {
        requestAnimationFrame(() => this.tick(frame + 1))
      }
    },
    async switchCamera () {
      const devices = (await navigator.mediaDevices.enumerateDevices())
        .filter(d => d.kind === 'videoinput')
      const index = (devices.findIndex(d => d.deviceId === this.camera) + 1) % devices.length
      this.track.stop()
      await this.start({
        audio: false,
        video: {
          width: 720,
          deviceId: devices[index].deviceId
        }
      })
    }
  },
  watch: {
    flash (value) {
      this.track.applyConstraints({ advanced: [{ torch: value }] })
    }
  }
}
</script>