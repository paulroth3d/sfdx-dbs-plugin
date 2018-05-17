/*jshint esversion: 6*/

const easyTable = require('easy-table');

/**
 * Converts and Prints an SObject Describe into a readible format.
 * 
 * @class FieldDescribePrinter
 */
class FieldDescribePrinter {

  /**
   * Prints the short information for all fields
   * @param sObjectDescription
   */
  printSObjectFields(sObjectDescription, sortBy){
    const table = new easyTable();

    var field;
    var fieldName;
    var fieldType;
    for (var i = 0; i < sObjectDescription.fields.length; i++){
      field = sObjectDescription.fields[i];
  
      table.cell('name', this.printFieldName(field));
      table.cell('type', this.printFieldType(field));
      table.cell('label', field.label);
      table.newRow();
    }

    if (!sortBy){
      sortBy = 'name|asc';
    }
    table.sort([sortBy]);

    console.log(table.toString());
  }

  printFieldName(fieldDescription){
    var result = (fieldDescription.custom ? 'C' : 'S') + ' - ' +
    fieldDescription.name;
    return result;
  }

  printFieldType(fieldDescription){
    var result = fieldDescription.type;
    if (fieldDescription.length > 0){
      result += ' [' + fieldDescription.length  + ']';
    }
    return result;
  }
}

module.exports = new FieldDescribePrinter();