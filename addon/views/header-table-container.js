import Ember from 'ember';
import TableContainer from 'ember-table/views/table-container';
import ShowHorizontalScrollMixin from 'ember-table/mixins/show-horizontal-scroll';
import RegisterTableComponentMixin from 'ember-table/mixins/register-table-component';

export default TableContainer.extend(
  ShowHorizontalScrollMixin, RegisterTableComponentMixin, {
    templateName: 'header-table-container',
    classNames: ['ember-table-table-container',
      'ember-table-fixed-table-container',
      'ember-table-header-container'],
    height: Ember.computed(function () {
      var oldHeight = this.get('tableComponent._headerHeight');
      if (this.get('hasColumnGroup')) {
        return oldHeight * 2;
      } else {
        return oldHeight;
      }
    }).property('tableComponent._headerHeight'),

    width: Ember.computed.alias('tableComponent._tableContainerWidth'),
    hasColumnGroup: Ember.computed(function () {
      return this.get('tableComponent.hasColumnGroup');
    }),

    // Options for jQuery UI sortable
    sortableOption: Ember.computed(function () {
      return {
        axis: 'x',
        containment: 'parent',
        cursor: 'move',
        helper: 'original',
        //items: ".ember-table-header-block.sortable",
        opacity: 0.9,
        //placeholder: 'ui-state-highlight',
        scroll: true,
        tolerance: 'intersect',
        update: Ember.$.proxy(this.onColumnSortDone, this)
        //stop: Ember.$.proxy(this.onColumnSortStop, this),
        //sort: Ember.$.proxy(this.onColumnSortChange, this)
      };
    }),

    didInsertElement: function () {
      console.log("Insert Element");
      this._super();
      if (this.get('tableComponent.enableColumnReorder')) {
        this.$('> div').sortable(this.get('sortableOption'));
        this.$('> div').disableSelection();
      }
    },

    willDestroyElement: function () {
      console.log("destroy");
      if (this.get('tableComponent.enableColumnReorder')) {
        // TODO(azirbel): Get rid of this check, as in onColumnSortDone?
        var $divs = this.$('> div');
        if ($divs) {
          $divs.sortable('destroy');
        }
      }
      this._super();
    },

    onScroll: function (event) {
      this.set('scrollLeft', event.target.scrollLeft);
      event.preventDefault();
    },

    onColumnSortStop: function() {
      this.set('tableComponent._isShowingSortableIndicator', false);
    },

    onColumnSortChange: function() {
      var left = this.$('.ui-state-highlight').offset().left -
        this.$().closest('.ember-table-tables-container').offset().left;

      console.log(this.$('.ui-state-highlight').offset().left);
      this.set('tableComponent._isShowingSortableIndicator', true);
      this.set('tableComponent._sortableIndicatorLeft', left);
    },

    onColumnSortDone: function(event, ui) {
      var newIndex = ui.item.index();
      //this.$('> div').sortable('cancel');
      var view = Ember.View.views[ui.item.attr('id')];
      var column = view.get('columnGroup');
      this.get('tableComponent').onColumnSort(column, newIndex);
      //this.set('tableComponent._isShowingSortableIndicator', false);
    }
  });
