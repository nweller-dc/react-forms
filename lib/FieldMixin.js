/**
 * @jsx React.DOM
 */
'use strict';

var React             = require('react');
var cloneWithProps    = require('react/lib/cloneWithProps');
var mergeInto         = require('react/lib/mergeInto');
var getTypeFromSchema = require('./getTypeFromSchema');
var FormElementMixin  = require('./FormElementMixin');

var FieldMixin = {
  mixins: [FormElementMixin],

  propTypes: {
    input: React.PropTypes.component
  },

  onChange: function(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    var value = getValueFromEvent(e);

    this.updateValue(value);
  },

  renderInputComponent: function(props) {
    var value = this.value();
    var validation = this.validation();
    var schema = this.schema();

    if (validation.isSuccess) {
      value = getTypeFromSchema(schema).serialize(value);
    }

    var input = this.props.input || schema && schema.props.input;
    var inputProps = {value, onChange: this.onChange};

    if (props) {
      mergeInto(inputProps, props);
    }

    if (input) {
      return cloneWithProps(input, inputProps);
    } else {
      inputProps.type = 'text';
      return React.DOM.input(inputProps);
    }
  }
};

/**
 * Extract value from event
 *
 * We support both React.DOM 'change' events and custom change events
 * emitted from custom components.
 *
 * This function also normalizes empty strings to null.
 *
 * @param {Event} e
 */
function getValueFromEvent(e) {
  return e && e.target && e.target.value !== undefined ?
    e.target.value : e;
}

module.exports = FieldMixin;