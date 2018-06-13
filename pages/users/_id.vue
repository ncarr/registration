<template>
  <v-app>
    <v-toolbar app fixed>
      <v-btn icon nuxt to="/users"><v-icon>arrow_back</v-icon></v-btn>
      <v-toolbar-title v-if="$route.params.id === 'new'">New user</v-toolbar-title>
      <v-toolbar-title v-else>Edit user</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container>
        <v-layout>
          <v-flex sm6 offset-sm3 xs12>
            <v-card>
              <v-card-text>
                <section>
                  <v-subheader>Metadata</v-subheader>
                  <v-select
                    v-model="member.roles"
                    :items="roles"
                    label="Roles"
                    chips
                    tags
                  />
                  <v-text-field
                    label="Email"
                    v-model="member.email"
                  />
                  <v-switch
                    label="Email verified"
                    hint="Ensure user actually owns this email before enabling"
                    v-model="member.emailVerified"
                  />
                  <v-text-field
                    label="Google account ID"
                    hint="Advanced: Grants this Google user access to the account, change only if certain"
                    v-model="member.googleID"
                  />
                  <v-switch
                    label="Enable sign-in through email links"
                    hint="Ensure this or the related Google sign-in option is set"
                    v-model="member.emailSignInEnabled"
                  />
                  <v-switch
                    label="Enable sign-in with Google"
                    hint="Ensure this or the related email sign-in option is set"
                    v-model="member.googleSignInEnabled"
                  />
                  <v-select
                    label="Tokens"
                    :items="[]"
                    v-model="member.tokens"
                    hint="Advanced: If misconfigured, this could open this account to unauthorized logins"
                    chips
                    tags
                  />
                </section>
                <section>
                  <v-subheader>Profile</v-subheader>
                  <v-text-field
                    label="Name"
                    v-model="member.name"
                  />
                  <v-text-field
                    label="Phone number"
                    v-model="member.phone"
                  />
                  <v-text-field
                    label="Date of birth"
                    v-model="member.birth"
                    type="date"
                  />
                  <v-text-field
                    multi-line
                    label="Dietary restrictions"
                    v-model="member.dietaryRestrictions"
                  />
                  <v-text-field
                    multi-line
                    label="Special needs"
                    v-model="member.specialNeeds"
                  />
                  <v-text-field
                    label="School"
                    v-model="member.school"
                  />
                  <v-text-field
                    label="City"
                    v-model="member.city"
                  />
                  <v-text-field
                    label="Province"
                    v-model="member.province"
                  />
                  <v-text-field
                    label="Country"
                    v-model="member.country"
                  />
                  <v-select
                    combobox
                    :items="pronouns"
                    label="Pronouns"
                    v-model="member.pronouns"
                  />
                  <v-select
                    :items="shirtSizes"
                    label="Shirt Size"
                    v-model="member.shirtSize"
                  />
                </section>
                <section v-if="member.roles && member.roles.includes('applicant')">
                  <v-subheader>Application</v-subheader>
                  <v-text-field
                    multi-line
                    label="What was your best acheivement? It doesn't have to be computer-related. (1500 chars max)"
                    v-model="member.acheivement"
                  />
                  <v-text-field
                    multi-line
                    label="Any other links (GitHub, LinkedIn, personal website, etc.)"
                    v-model="member.links"
                  />
                  <v-text-field
                    multi-line
                    label="Anything else? (1500 chars max)"
                    v-model="member.other"
                  />
                </section>
                <section v-if="member.roles && member.roles.includes('applicant')">
                  <v-subheader>Application metadata</v-subheader>
                  <v-text-field
                    label="Date submitted (leave blank if unsubmitted)"
                    type="date"
                    v-model="member.submitted"
                  />
                  <v-text-field
                    label="Date accepted (leave blank if not accepted yet)"
                    type="date"
                    v-model="member.accepted"
                  />
                  <v-select
                    label="Application status"
                    :items="statuses"
                    v-model="member.status"
                  />
                </section>
                <section>
                  <v-subheader>Audit log</v-subheader>
                  <v-text-field
                    label="Explain why you made this change"
                    multi-line
                    v-model="member.message"
                  />
                </section>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="submit" color="primary">Save</v-btn>
                <v-btn flat color="error" @click="remove" v-if="$route.params.id !== 'new'">Delete</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  async asyncData ({ app, params }) {
    if (params.id === 'new') {
      return {
        member: {
          emailSignInEnabled: true,
          googleSignInEnabled: true,
          status: 0,
          roles: ['applicant']
        }
      }
    }
    const { data } = await app.$axios.get(`/users/${params.id}`)
    return { member: data }
  },
  data: () => ({
    drawer: undefined,
    roles: [
      'organizer',
      'applicant',
      'volunteer',
      'mentor'
    ],
    pronouns: [
      'He/Him/His',
      'She/Her/Hers',
      'They/Them/Their'
    ],
    shirtSizes: [
      'XS',
      'S',
      'M',
      'L',
      'XL'
    ],
    statuses: [
      { text: 'Unsubmitted', value: 0 },
      { text: 'Under review', value: 1 },
      { text: 'Rejected', value: 2 },
      { text: 'Accepted', value: 3 },
      { text: 'Can\'t come', value: 4 },
      { text: 'Going', value: 5 }
    ]
  }),
  methods: {
    async submit () {
      if (this.$route.params.id === 'new') {
        await this.$axios.post('/users', this.member)
      } else {
        await this.$axios.patch(`/users/${this.$route.params.id}`, this.member)
      }
      this.$router.push('/users')
    },
    async remove () {
      await this.$axios.delete(`/users/${this.$route.params.id}`)
      this.$router.push('/users')
    }
  }
}
</script>