define(['can', 'jquery', 'jqueryui'],
  function () {
    return can.Construct.extend({
      init: function (options) {
        this.$el = $(options.dlgTempate).dialog({
          width: options['width'] || 'auto',
          height: options['height'] || 'auto',
          autoOpen: options['autoOpen'] || false,
          modal: options['modal'] || true,
          closeText: options['closeText'] || "Cancel",
          draggable: options['draggable'] || true,
          resizable: options['resizable'] || false,
          buttons: options.buttons || { text: 'Cancel' },
        });

        if (options.hasOwnProperty('events')) {
          this.$el.dialog(options['events']);
        }
      }
    });
  });