/*jshint esversion: 6*/

const _ = require('underscore');
const Q = require('q');

/**
 * Class that prints things or lists of things in a pretty way
 * 
 * @class MdApiPrinter
 */
class MdApiPrinter {
  
  /**
   * Sorts and prints entries from a list
   * 
   * @param {string[]} list - collection of items to print
   * @param {string} messageIfEmptyList - message to provide if list is empty
   * @memberof MdApiPrinter
   */
  sortAndPrintList(list, messageIfEmptyList){
    if (!list || list.length < 1){
      console.log(messageIfEmptyList);

      return list;
    } else {
      const sortedList = _.sortBy(list, function(str){
        return (str);
      });

      for (var j = 0; j < sortedList.length; j++){
        console.log(sortedList[j]);
      }

      return sortedList;
    }
  }
}

module.exports = new MdApiPrinter();
