import Ember from "ember";
import { module, test } from 'qunit';
import ColumnGroupDefinition from 'ember-table/models/column-group-definition';
import ColumnDefinition from 'ember-table/models/column-definition';

var column;

module('column definition without sortBy', {
  beforeEach: function() {
    column = ColumnDefinition.create({
      headerCellName: 'Column1',
      getCellContent: function (row) {
        return row.get('c');
      }
    });
  },

  afterEach: function(){
    column = null;
  }
});

test('it should return undefined if column do not have sortBy', function (assert) {
  var sortFn = column.sortFn();
  assert.ok(!sortFn);
});

module('column definition with sortBy', {
  beforeEach: function() {
    column = ColumnDefinition.create({
      headerCellName: 'Column1',
      sortBy: function(prev, next){
        return prev.id - next.id;
      },
      getCellContent: function (row) {
        return row.get('c');
      }
    });
  },

  afterEach: function(){
    column = null;
  }
});

test('sortFn should reverse sort order on second time ', function (assert) {
  var ascSortFn = column.sortFn();

  assert.equal(ascSortFn({id: 2}, {id: 3}), -1);

  var descSortFn = column.sortFn();

  assert.equal(descSortFn({id: 2}, {id: 3}), 1);
});
