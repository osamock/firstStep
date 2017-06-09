/*
    AppModel

 */

function AppModel(attrs) {
    this.val = '';
    this.attrs = {
        required: '',
        maxlength: 8,
        minlength: 4
    }, this.listeners = {
        valid: [],
        invalid: []
    };
}

AppModel.prototype.on = function (event, func) {
    this.listeners[event].push(func);
}

AppModel.prototype.trigger = function (event) {
    $.each(this.listeners[event], function () {
        this();
    });
};

AppModel.prototype.set = function (val) {
    if (this.val === val) {
        return;
    }
    this.val = val;
    this.validate();
};

AppModel.prototype.required = function () {
    return this.val !== '';
};

AppModel.prototype.maxlength = function (num) {
    return num >= this.val.length;
};

AppModel.prototype.minlength = function (num) {
    return num <= this.val.length;
};

AppModel.prototype.validate = function () {
    var val;
    this.errors = [];

    for (var key in this.attrs) {
        val = this.attrs[key];
        if (!this[key](val)) {
            this.errors.push(key);
        }
    }
    this.trigger(!this.errors.length ? 'valid' : 'invalid');
};




/*
    AppView
 */
function AppView(el) {
    this.initialize(el);
    this.handleEvents();
}

AppView.prototype.initialize = function (el) {
    this.$el = $(el);

    // TODO error ocured at next method() why?
    this.$list = this.$el.next().children();

    // TODO what is the returned value from this 'data' method?
    var obj = this.$el.data();
    console.log('line77 : ' + obj)

    // TODO Actually I can not understand this around here.
    if (this.$el.prop('required')) {
        obj['required'] = '';
    }
    this.model = new AppModel(obj);
};

AppView.prototype.handleEvents = function (el) {
    var self = this;

    this.$el.on('keyup', function (e) {
        self.onKeyup(e);
    });

    this.model.on('valid', function () {
        self.onValid();
    });

    this.model.on('invalid', function () {
        self.onInvalid();
    });
};

AppView.prototype.onKeyup = function (e) {
    var $target = $(e.currentTarget);
    this.model.set($target.val());
};

AppView.prototype.onValid = function () {
    this.$el.removeClass('error');
    this.$list.hide();
};

AppView.prototype.onInvalid = function () {
    var self = this;
    this.$el.addClass('error');
    this.$list.hide();
    // TODO I can not understand filter method. check it out later.
    $.each(this.model.errors, function (index, val) {
        self.$list.filter('[data-error=\"' + val + '\"]').show();
    });
};

var count = 0;
$('input').each(function () {
    count++;
    console.log('line 125 is called : ' + count);
    new AppView(this);
});
