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
        <td class="table__index"># {{block.index}} </td>
        <td> {{block.transactions.length}} </td>
        <td class="table__timestamp">{{block.timestamp}} </td>
        <td>
          <a :href="'/api/block/' + block.hash"><div class="button"> Show </div></a>
        </td>
      </tr>
    </table>
  `
})

Vue.component('recent-transactions-table', {
  data: function () {
    return {
      transactions: []
    }
  },
  mounted () {
    axios
      .get('api/recentTransactions')
      .then((response) => {
        this.transactions = response.data
      })
  },
  template: `
    <table>
      <tr>
        <th> Transaction amount </th>
        <th> Recipient </th>
        <th> </th>
      </tr>
      <tr v-for="transaction in transactions">
        <td class="table__index">{{transaction.amount}} coins</td>
        <td> {{transaction.to}} </td>
        <td>
        <a :href="'/api/transaction/' + transaction.hash"><div class="button"> Show </div></a>
        </td>
      </tr>
    </table>
  `
})

Vue.component('blockchain-stats', {
  data: function () {
    return {
      stats: []
    }
  },
  mounted () {
    axios
      .get('api/stats')
      .then((response) => {
        this.stats = response.data
      })
  },
  template: `
    <div class="statsPanel">
      <div class="statsPanel__stats" v-for="stat in stats">
        <div class="statsPanel__title"> {{stat.title}} </div>
        <div class="statsPanel__content"> {{stat.content}} </div>
      </div>
    </div>
  `
})

var app = new Vue({
  el: '#app'
})
