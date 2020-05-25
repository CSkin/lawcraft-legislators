// -------------------------{  Custom Methods  }-------------------------

Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
}

// ------------------------{  Data Preparation  }------------------------

class Section {
  constructor(row, section, legislators, isUnlocked) {
    this.row = row;
    this.section = section;
    this.legislators = legislators;
    this.isUnlocked = isUnlocked;
  }
}

function resetData () {
  const appData = [];
  for (let r = 0; r < 3; r++) {
    var row = [];
    for (let s = 0; s < 6; s++) {
      row.push(new Section(r, s, 0, true));
    }
    appData.push(row);
  }
  return appData;
}

const issues = [
  'School Support',
  'Civic Engagement',
  'Employment Aids',
  'Business Innovation',
  'Better Wages',
  'Air & Water Quality',
  'Natural Resources',
  'Future of Energy',
  'Drug Abuse',
  'Prevent Terrorism',
  'Justice Reform',
  'Space Exploration',
  'Food Safety',
  'Healthcare',
  'Social Services'
];

$( document ).ready( function () {

// -------------------------{  Vue Components  }-------------------------

var DisplayLabel = {
  template:`
    <div class='label' :style='{ backgroundColor: labelColor }'>
      <label>{{ labelText }}</label>
    </div>
  `,
  data: function () { return {
    values: [
      ['Cooperation', 'Competition'],
      ['Generosity', 'Cost Saving'],
      ['Equality', 'Liberty']
    ],
    colors: [
      ['#cc6666', '#66cccc'],
      ['#6666cc', '#cc9966'],
      ['#cc6699', '#99cc66']
    ]};
  },
  props: ['row', 'labelIndex'],
  computed: {
    labelText: function () {
      return this.values[this.row][this.labelIndex];
    },
    labelColor: function () {
      return this.colors[this.row][this.labelIndex];
    }
  }
}

var DisplaySeat = {
  template:`
    <div class='seat'>
      <img class='legislator' src='legislator50.png' alt='legislator'
        v-if='occupied'>
    </div>
  `,
  props: ['occupied']
}

var DisplaySection = {
  template:`
    <div class='section' :style='{ backgroundColor: sectionColor }'>
      <display-seat
        v-for='(seat, index) in seatsArray'
        :occupied='seat'
        :key='index'
      ></display-seat>
    </div>
  `,
  data: function () { return {
    colors: [
      ['#bd7575', '#af8383', '#a09292', '#92a0a0', '#83afaf', '#75bdbd'],
      ['#756dbd', '#8375af', '#927ca0', '#a08392', '#af8a83', '#bd9275'],
      ['#c57592', '#bd838a', '#b69283', '#afa07c', '#a8af75', '#a0bd6d']
    ]};
  },
  props: ['row', 'section', 'legislators'],
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
    },
    sectionColor: function () {
      return this.colors[this.row][this.section];
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
        :row='row'
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
    appData: resetData(),
    chamberSize: 25,
    issues: issues,
    currentIssue: 'empty'
  },
  computed: {
    flatData: function () {
      return this.appData.flat();
    },
    legislatorsLocked: function () {
      return this.flatData
        .filter(section => !section.isUnlocked)
        .reduce((acc, cur) => acc + cur.legislators, 0);
    }
  },
  methods: {
    generateLegislators: function () {
      // Wipe unlocked sections
      this.flatData.forEach( function (s) {
        if (s.isUnlocked && s.legislators > 0) {
          App.appData[s.row][s.section].legislators = 0;
        }
      });
      // Calculate # legislators to add
      var toAdd = added = this.chamberSize - this.legislatorsLocked;
      // Add legislators
      while (toAdd > 0) {
        var eligibleSections = App.flatData
          .filter(s => s.isUnlocked && s.legislators < 4);
        var random = eligibleSections.random();
        App.appData[random.row][random.section].legislators++;
        toAdd--;
      }
      console.log("Generated " + added + " legislators.");
    },
    loadIssue: function () {
      if (this.currentIssue == 'empty') {
        this.appData = resetData();
        console.log("Loaded empty floor");
      } else {
        var key = 'issue' + this.currentIssue;
        if (localStorage.getItem(key)) {
          this.appData = JSON.parse(localStorage.getItem(key));
          console.log("Loaded " + this.issues[this.currentIssue]);
        } else {
          console.log("No saved data for " + this.issues[this.currentIssue]);
        }
      }
    },
    saveIssue: function () {
      if (this.currentIssue == 'empty') {
        console.log("No issue selected");
      } else {
        var key = 'issue' + this.currentIssue,
            value = JSON.stringify(this.appData);
        localStorage.setItem(key, value);
        console.log("Saved " + this.issues[this.currentIssue]);
      }
    }
  },
  components: {
    'display-row': DisplayRow,
    'input-row': InputRow
    // 'output-data': OutputData
  }
});

}); // end of document ready function
