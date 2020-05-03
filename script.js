// -------------------------{  Custom Methods  }-------------------------

Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
}

// ------------------------{  Data Preparation  }------------------------

const appData = [];

class Section {
  constructor(row, section, legislators, isUnlocked) {
    this.row = row;
    this.section = section;
    this.legislators = legislators;
    this.isUnlocked = isUnlocked;
  }
}

for (let r = 0; r < 3; r++) {
  var row = [];
  for (let s = 0; s < 6; s++) {
    row.push(new Section(r, s, 0, true));
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
        v-for='section in rowData'
        :section='section.section'
        :legislators='section.legislators'
        :key='section.section'
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
      App.appData[this.row][this.section].legislators = Number(value);
    },
    updateLock: function (checked) {
      App.appData[this.row][this.section].isUnlocked = checked;
    }
  }
}

var InputRow = {
  template:`
    <div class='row'>
      <input-section
        v-for='section in rowData'
        :row='section.row'
        :section='section.section'
        :legislators='section.legislators'
        :isUnlocked='section.isUnlocked'
        :key='section.section'
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
    appData: appData,
    chamberSize: 25
  },
  computed: {
    legislatorsLocked: function () {
      return this.appData
        .flat()
        .filter(section => !section.isUnlocked)
        .reduce((acc, cur) => acc + cur.legislators, 0);
    }
  },
  methods: {
    generateLegislators: function () {
      // Wipe unlocked sections
      this.appData.flat().forEach( function (s) {
        if (s.isUnlocked && s.legislators > 0) {
          App.appData[s.row][s.section].legislators = 0;
        }
      });
      // Calculate # legislators to add
      var toAdd = added = this.chamberSize - this.legislatorsLocked;
      // Add legislators
      while (toAdd > 0) {
        var eligibleSections = App.appData
          .flat()
          .filter(s => s.isUnlocked && s.legislators < 4);
        var random = eligibleSections.random();
        App.appData[random.row][random.section].legislators++;
        toAdd--;
      }
      console.log("Generated " + added + " legislators.");
    }
  },
  components: {
    'display-row': DisplayRow,
    'input-row': InputRow
    // 'output-data': OutputData
  }
});

}); // end of document ready function
