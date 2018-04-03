var app = new Vue({
  el: '#dashBoard',
  data: {
    recentBlocks: []
  },
  mounted () {
    axios
      .get('api/blocks')
      .then((response) => {
        this.recentBlocks = response.data
      })
  }
})