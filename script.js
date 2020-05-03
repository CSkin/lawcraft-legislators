// ------------------------{  Data Preparation  }------------------------

const appData = [];

class Section {
  constructor(legislators, isUnlocked) {
    this.legislators = legislators;
    this.isUnlocked = isUnlocked;
  }
}

for (let m = 3; m > 0; m--) {
  var row = [];
  for (let n = 6; n > 0; n--) {
    row.push(new Section(0, true));
  }
  appData.push(row);
}

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
  props: ['row', 'labelIndex'],
  computed: {
    labelText: function () {
      return this.values[this.row][this.labelIndex];
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
        v-for='(seat, index) in seatsArray'
        :occupied='seat'
        :key='index'
      ></display-seat>
    </div>
  `,
  props: ['section', 'legislators'],
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
      <display-label :row='row' :label-index='0'></display-label>
      <display-section
        v-for='(section, index) in rowData'
        :section='index'
        :legislators='section.legislators'
        :key='index'
      ></display-section>
      <display-label :row='row' :label-index='1'></display-label>
    </div>
  `,
  props: ['row', 'rowData'],
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
        :disabled='!isUnlocked'
        @change='updateLegislators($event.target.value)'
      ></input>
      <input
        type='checkbox'
        :checked='isUnlocked'
        @change='updateLock($event.target.checked)'
      >
    </div>
  `,
  props: ['row', 'section', 'legislators', 'isUnlocked'],
  computed: {

  },
  methods: {
    updateLegislators: function (value) {
      var appData = App.appData;
      appData[this.row][this.section].legislators = Number(value);
      App.appData = appData;
    },
    updateLock: function (checked) {
      var appData = App.appData;
      appData[this.row][this.section].isUnlocked = checked;
      App.appData = appData;
    }
  }
}

var InputRow = {
  template:`
    <div class='row'>
      <input-section
        v-for='(section, index) in rowData'
        :row='row'
        :section='index'
        :legislators='section.legislators'
        :isUnlocked='section.isUnlocked'
        :key='index'
      ></input-section>
    </div>
  `,
  props: ['row', 'rowData'],
  components: {
    'input-section': InputSection
  }
}

// --------------------------{  Vue Instance  }--------------------------

var App = new Vue ({
  el: '#app',
  data: {
    appData: appData
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
