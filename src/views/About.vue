<template>
  <div class="container row">
    <v-card class="col s12 l10  xl8  offset-xl2 offset-l1">
      <v-card-text>
        <h4>About Us</h4>
        <div id="greeting">
          Thank you for visiting our site!!
        </div>
        <p>
          Grew up in a vulnerable democracy, all three members of the VERTAS
          team understand and appreciate the freedom enjoyed here in the US,
          especially the freedom of speech. Seeing this sacred idea being abused
          by falsehoods and misinformation makes us believe that it is our duty
          to protect it, hence the idea for VERTAS.
        </p>
        <p>
          VERTAS was created as platform for everyone to read and discuss news
          articles. In light of the Fake News Epidemic, we enable readers to
          read with confidence by allowing everyone to rate what they read for
          its level of TRUTH and BIAS demonstrated. We wholeheartedly believe
          that by democratizing information, we shall restore the public’s TRUST
          and DEPENDABILITY on the media.
        </p>
        <h4>The Rating</h4>
        We let the users rate the articles based on two criteria: accuracy and
        bias. All ratings are then converted into percentage scores for display.
        <ul>
          <li>
            The green color <span class="green-circle"> </span> represents the
            accuracy/truth rating.
          </li>
          <li>
            The red color <span class="red-circle"> </span> represents
            right-wing bias; for instance a&ensp;
            <span class="red-circle"> </span>
            <span class="font-weight-bold red--text text--darken-3">
              30&#65130;
            </span>
            rating means a 30% bias toward right-wing agenda.
          </li>
          <li>
            The blue color <span class="blue-circle"> </span> works the same
            way, but with left-wing bias.
          </li>
          <li>
            If an article is rated to be neutral/unbiased, a symbol
            <span class="red-circle"> </span>
            <span class="font-weight-bold red--text text--darken-3">
              0&#65130;
            </span>
            is simply displayed.
          </li>
        </ul>

        <!--  <div>
          You are currently using our web app.
          <a href="https://vertasbackend.web.app" target="_blank">
            Click here to visit our landing page.</a
          > 
        </div> -->
        <div>
          Based on the articles' ratings, we also present the overall ratings
          for outlets and authors.
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
div {
  font-size: 20px;
}
#greeting {
  font-weight: bold;
}
ul {
  padding-left: 24px;
}
ul:not(.browser-default) > li {
  list-style-type: disc;
}
.green-circle {
  height: 20px;
  width: 20px;
  background-color: #4caf50;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  top: 2px;
}
.red-circle {
  height: 20px;
  width: 20px;
  background-color: #c62828;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  top: 2px;
}
.blue-circle {
  height: 20px;
  width: 20px;
  background-color: #1e88e5;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  top: 2px;
}
</style>
