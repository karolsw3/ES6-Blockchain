Vue.component('recent-blocks-table', {
  data: function () {
    return {
      blocks: []
    }
  },
  mounted () {
    axios
      .get('api/recentBlocks')
      .then((response) => {
        this.blocks = response.data
      })
  },
  template: `
    <table>
      <tr>
        <th> Block index </th>
        <th> Transactions </th>
        <th> Timestamp </th>
        <th> </th>
      </tr>
      <tr v-for="block in blocks">
        <td class="recentBlocks__index"># {{block.index}} </td>
        <td> {{block.transactions.length}} </td>
        <td class="recentBlocks__timestamp">{{block.timestamp}} </td>
        <td>
          <div class="button"> Show </div>
        </td>
      </tr>
    </table>
  `
})

var app = new Vue({
  el: '#dashBoard'
})
