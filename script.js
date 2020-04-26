// ------------------------{  Data Preparation  }------------------------

var appData = [
  [0, 0, 2, 0, 0, 0],
  [0, 0, 0, 3, 0, 0],
  [0, 0, 0, 0, 0, 0]
]

$( document ).ready( function () {

// -------------------------{  Vue Components  }-------------------------

var RowLabel = {
  template:`
    <div class='label'>
      <span>{{ labelText }}</span>
    </div>
  `,
  data: function () { return {
    values: [
      ['Cooperation', 'Competition'],
      ['Generosity', 'Cost Saving'],
      ['Equality', 'Liberty']
    ]};
  },
  props: ['rowIndex', 'labelIndex'],
  computed: {
    labelText: function () {
      return this.values[this.rowIndex][this.labelIndex];
    }
  }
}

var SectionSeat = {
  template:`
    <div class='seat'>
      <span :class='{ green: occupied }'>{{ occupied }}</span>
    </div>
  `,
  props: ['occupied']
}

var RowSection = {
  template:`
    <div class='section'>
      <section-seat
        v-for='(item, index) in seatsArray'
        :occupied='item'
        :key='index'
      ></section-seat>
    </div>
  `,
  props: ['sectionIndex', 'legislators'],
  computed: {
    seatsArray: function () {
      let seatsArray = [false, false, false, false];
      let unassigned = this.legislators;
      while (unassigned > 0) {
        // Find indexes of open seats
        let openSeats = [];
        seatsArray.forEach(function(seat, index){
          if (!seat) { openSeats.push(index); }
        });
        // Fill a random open seat
        let openSeat = openSeats[Math.floor(Math.random() * openSeats.length)];
        seatsArray[openSeat] = true;
        unassigned--;
      }
      return seatsArray;
    }
  },
  components: {
    'section-seat': SectionSeat
  }
}

var DisplayRow = {
  template: `
    <div class='row'>
      <row-label :row-index='rowIndex' :label-index='0'></row-label>
      <row-section
        v-for='(item, index) in rowArray'
        :section-index='index'
        :legislators='item'
        :key='index'
      ></row-section>
      <row-label :row-index='rowIndex' :label-index='1'></row-label>
    </div>
  `,
  props: ['rowIndex', 'rowArray'],
  components: {
    'row-label': RowLabel,
    'row-section': RowSection
  }
}

// --------------------------{  Vue Instance  }--------------------------

var App = new Vue ({
  el: '#app',
  data: {
    data: appData
  },
  computed: {
    prop: function () {

    }
  },
  methods: {
    method: function () {

    }
  },
  components: {
    'display-row': DisplayRow
    // 'input-row': InputRow,
    // 'output-data': OutputData
  }
});

}); //end of document ready function
