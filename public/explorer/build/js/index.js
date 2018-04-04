var app = new Vue({
  el: '#dashBoard',
  data: {
    recentBlocks: []
  },
  mounted () {
    axios
      .get('api/recentBlocks')
      .then((response) => {
        this.recentBlocks = response.data
      })
  }
})