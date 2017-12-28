/* global $, location */ // varible arguement to avoid false linter
/*
Script : uniqueness 0.1 beta
Author : Mohamed Feddad
Date : 2017/12/10
Source : https://github.com/mrf345/uniqueness
License: MPL 2.0
Dependencies : jQuery, jQuery UI (optional)
Today's lesson: organizing is time consuming for now, and time saving for later
*/

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Custome pythonic functions to make me feel like home
var checkType = function checkType (type, args) {
  // checking the type of each varible in the passed array
  for (var a in args) {
    if (typeof args[a] !== type) return false
  }
  return true
}

var randint = function randint (digits) {
// to generate a random int of certain range, it takes the length of
// the randint as an arguement
  if (!checkType('number')) throw new TypeError('randint() requires numbers')
  return Math.floor(Math.random() * (10 ** digits))
}

var choice = function choice (list) {
// to chose randomly from an Array
  if (!(list instanceof Array)) throw new TypeError('choice() taskes only Arrays')
  if (list.length <= 0) throw new Error('choice() requires pupliated Array')
  var powerOfLength = Math.floor(list.length / 10)
  if (powerOfLength <= 0) powerOfLength = 1
  return list[Math.floor(Math.random() * (10 * powerOfLength))]
}

// jquery ui effects
var effects = [
  'blind', 'bounce', 'clip',
  'drop', 'explode', 'fade',
  'fold', 'highlight', 'puff',
  'pulsate', 'scale', 'shake',
  'size', 'slide']

var uniqueness = function Unique (options) {
  // main class that contains all functions
  if (!window.jQuery) throw new Error('This script depends fully on jquery, go get it') // check for jquery
  if (typeof options !== 'object') options = {}
  this.options = {
    // options to be passed by you, and its default replacement
    identifier: options.identifier || '.uniqueness', // class or id to identify elements by
    start_with: options.start_with || 0, // element index number to start from
    use_effects: options.use_effects || 'true', // to use transitional jquery UI effects
    effect: options.effect || choice(effects), // to get or set a random effect
    effect_duration: options.effect_duration || randint(3), // to get or set a random effect duration
    local_url: options.local_url || 'false' // to goto() via parsing index varible from url
  }
  this.turn = 0 // currently showen element
  this.s_length = $(this.options.identifier).length // length of the selected elements
  this.m_length = this.s_length - 1 // length deducted for ease of use

  this.__init__ = function __init__ () {
    // initial function to check the options and selection validity.
    // check for jquery ui and its effects, if use effects
    if (this.options.use_effects === 'true' && !$.ui) throw new Error('Effects depends on Jquery ui, go get it. or do not use effects !')
    // check types
    var bol, b  // pure booleans does not function with ||
    for (b in bol = [
      this.options.use_effects,
      this.options.local_url]) {
      if (bol[b] !== 'true' && bol[b] !== 'false') throw new TypeError("unique(options) require 'true' or 'false'")
    }
    if (!checkType('string', [
      this.options.identifier,
      this.options.effect])) throw new TypeError('unique(options) require string')
    if (!checkType('number', [
      this.options.effect_duration,
      this.options.start_with])) throw new TypeError('unique(options=effect_duration,start_with) requires number')
    if (this.options.start_with > this.m_length || this.options.start_with < 0) throw new Error('unique(start_with) requires a valid index number')
    // hide the selected elements accourding to options
    var tempSelected = $(this.options.identifier)
    tempSelected = tempSelected.not($(this.options.identifier + ':eq(' + this.options.start_with + ')'))
    tempSelected.toggle()
    // lunching url parser if allowed and settling the first element
    if (this.options.local_url === 'true') this.turn = this.localUrl() || this.options.start_with
    else this.turn = this.options.start_with
    return true
  }

  this.effect = function effect (effect, duration, index) {
    // to applay the effect and toggle the element
    var thefd = this.options.identifier + ':eq(' + index + ')'
    if (effects.indexOf(effect) === -1) {
      throw new Error('effect(effect) taskes a valid jquery ui effect')
    } else {
      if (this.options.use_effects === 'true') {
        $(thefd).stop().toggle(effect, {}, duration)
      } else $(thefd).stop().toggle()
    }
  }

  this.checkLength = function checkLength () {
    // check length of selection for validity
    if (this.s_length <= 0) {
      throw new Error('unique(options=identifier) not enough elements to iterate')
    }
  }

  this.goto = function goto (index) {
    // to validate the index value and send it to the effect function
    this.checkLength()
    if (!checkType('number', index)) throw new TypeError('goto() requires number')
    if (index > this.m_length || index < 0) throw new Error('goto() requires a valid index number')
    // check if the element to be unhidden is actually hidden
    if ($(this.identifier + ':eq(' + this.turn + ')').css('display') !== 'none') {
      this.effect(this.options.effect, this.options.effect_duration, this.turn)
    } // to avoid first and last hide issues
    this.effect(this.options.effect, this.options.effect_duration, index)
    this.turn = index
  }
  this.next = function next () {
    // to toggle the next element in selection
    this.checkLength()
    this.effect(this.options.effect, this.options.effect_duration, this.turn)
    if (this.turn >= this.m_length) this.turn = parseInt(-1) // weird behaviour without parseInt
    this.turn += 1
    this.effect(this.options.effect, this.options.effect_duration, this.turn)
  }
  this.back = function back () {
    // to toggle the previous element in selection
    this.checkLength()
    this.effect(this.options.effect, this.options.effect_duration, this.turn)
    if (this.turn < 0) this.turn = this.m_length
    this.turn -= 1
    this.effect(this.options.effect, this.options.effect_duration, this.turn)
  }

  this.localUrl = function localUrl () {
    // spliting the href looking for our index and magic word unique
    var url = location.href
    url = url.split('#')
    if (url.length < 2) {
      return false
    } else { // it contains #
      url = url[url.length - 1]
      if (url.slice(0, 6) === 'unique') { // found magic word
        url = url.slice(6)
        url = parseInt(url)
        this.goto(url)
        return url
      } else return false // return false so the || sets start_with option instead
    }
  }

  this.list = function (param) {
    // logging selected elements with their index number or returning object of them
    if (!param) {
      $(this.options.identifier).each(function (k, v) {
        console.table('Index : ' + k)
        console.table('HTML : ' + v.innerHTML)
        console.log('------------------')
      })
    } else {
      param = {}
      $(this.options.identifier).each(function (k, v) {
        param[k] = v
      })
      return param
    }
  }

  this.current = function () { return this.turn } // returning he currently displayed element index
  this.length = function () { return this.s_length } // returning the number of existing elements

  // run initiating function to make sure of selection validity and lack of errors
  this.__init__()
  return this // returning the class
}
