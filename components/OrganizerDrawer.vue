<template>
  <v-navigation-drawer app fixed clipped :value="value" @input="$emit('input', $event)">
    <v-list>
      <v-list-tile nuxt to="/dashboard">
        <v-list-tile-content>
          <v-list-tile-title>
            Home
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile nuxt to="/users">
        <v-list-tile-content>
          <v-list-tile-title>
            Users
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile nuxt to="/applications">
        <v-list-tile-content>
          <v-list-tile-title>
            Review applications
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile nuxt to="/scan">
        <v-list-tile-content>
          <v-list-tile-title>
            Scan tickets
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile nuxt to="/eventsettings">
        <v-list-tile-content>
          <v-list-tile-title>
            Event settings
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile nuxt to="/log">
        <v-list-tile-content>
          <v-list-tile-title>
            Audit log
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: ['value']
}
</script>
