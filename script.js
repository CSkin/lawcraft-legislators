// ------------------------{  Data Preparation  }------------------------

var legisData = [
  [0, 0, 2, 0, 0, 0],
  [0, 0, 0, 3, 0, 0],
  [0, 0, 0, 0, 0, 0]
];

var inputData = [
  [true, true, true, true, true, true],
  [true, true, true, true, true, true],
  [true, true, true, true, true, true]
];

$( document ).ready( function () {

// -------------------------{  Vue Components  }-------------------------

var DisplayLabel = {
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

var DisplaySeat = {
  template:`
    <div class='seat'>
      <span :class='{ green: occupied }'>{{ occupied }}</span>
    </div>
  `,
  props: ['occupied']
}

var DisplaySection = {
  template:`
    <div class='section'>
      <display-seat
        v-for='(item, index) in seatsArray'
        :occupied='item'
        :key='String(index) + item'
      ></display-seat>
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
    'display-seat': DisplaySeat
  }
}

var DisplayRow = {
  template: `
    <div class='row'>
      <display-label :row-index='rowIndex' :label-index='0'></display-label>
      <display-section
        v-for='(item, index) in legisArray'
        :section-index='index'
        :legislators='item'
        :key='String(index) + item'
      ></display-section>
      <display-label :row-index='rowIndex' :label-index='1'></display-label>
    </div>
  `,
  props: ['rowIndex', 'legisArray'],
  components: {
    'display-label': DisplayLabel,
    'display-section': DisplaySection
  }
}

var InputSection = {
  template:`
    <div class='section'>
      <input
        class='number-field'
        type='number'
        min='0'
        max='4'
        :value='legislators'
        :disabled='!unlocked'
        :key='String(rowIndex) + sectionIndex + unlocked'
        @change='updateLegislators($event.target.value)'
      ></input>
      <input
        type='checkbox'
        :checked='unlocked'
        @change='updateLock($event.target.checked)'
      >
    </div>
  `,
  props: ['rowIndex', 'sectionIndex', 'legislators', 'unlocked'],
  computed: {

  },
  methods: {
    updateLegislators: function (value) {
      let array = App.legisData[this.rowIndex];
      array[this.sectionIndex] = Number(value);
      App.$set(App.legisData, this.rowIndex, array);
    },
    updateLock: function (checked) {
      let array = App.inputData[this.rowIndex];
      array[this.sectionIndex] = checked;
      App.$set(App.inputData, this.rowIndex, array);
    }
  }
}

var InputRow = {
  template:`
    <div class='row'>
      <input-section
        v-for='(item, index) in legisArray'
        :row-index='rowIndex'
        :section-index='index'
        :legislators='item'
        :unlocked='inputArray[index]'
        :key='String(index) + item'
      ></input-section>
    </div>
  `,
  props: ['rowIndex', 'legisArray', 'inputArray'],
  components: {
    'input-section': InputSection
  }
}

// --------------------------{  Vue Instance  }--------------------------

var App = new Vue ({
  el: '#app',
  data: {
    legisData: legisData,
    inputData: inputData
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
    'display-row': DisplayRow,
    'input-row': InputRow
    // 'output-data': OutputData
  }
});

}); // end of document ready function
