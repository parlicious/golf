<template>
  <div class="hello">
    <h1> Make Your Picks </h1>
    <div v-if="loading">
      Loading ...
    </div>
    <div v-if="!loading && selectEmail">

      <form class="form-signin form-inline justify-content-center">
        <label class="sr-only" for="inlineFormInputName2">Email</label>
        <input
          v-model="email"
          type="text"
          class="form-control mb-2 mr-sm-2"
          id="inlineFormInputName2"
          placeholder="Email Address">

        <button
          v-on:click="loading=true"
          class="btn btn-primary mb-2">
          Let's Go
        </button>
      </form>
      <small> If you've already created picks, we'll look them up.</small>
      <p>{{email}}</p>
    </div>
  </div>
</template>

<script>
import { sha256 } from '../common/security';

export default {
  name: 'PicksComponent',
  data() {
    return {
      email: '',
      loading: false,
      selectEmail: true,
    };
  },
  asyncComputed: {
    async msg() {
      return sha256('hello world');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h3 {
    margin: 40px 0 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  .form-label-group {
    text-align: left;
  }

  .form-signin {
    padding-left: 5%;
    padding-right: 5%;
  }

  /*.btn-primary, .btn-primary:hover, .btn-primary:active, .btn-primary:visited {*/
  /*  background-color: #42b983 !important;*/
  /*}*/
</style>
