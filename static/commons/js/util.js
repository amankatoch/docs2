var lbs = {};
lbs.modules = {};
lbs.loadingMods = {};
lbs.loadedModules = {};
lbs.cache = {};
lbs.routes = {
};

/**
 * BaseModule client module
 * All controllers inherit from this one, for example /workspace and /smm inherit
 *   from this and everything under those modules inherit from /workspace or /smm
 * written by Harm Meijer: harmmeiier@gmail.com
 */
lbs.routes['/basemodule'] = {mod: 'lbs.basemodule', location: '/commons/js/util.js'};
lbs.routes['/global:modal'] = {mod: 'lbs.globalModal', location: '/commons/js/util.js'};
lbs.basemodule = lbs.modules['/basemodule'] = {
  pageComplete : function(){
    //@todo: certain pages need effects scripted after they are done, do that in this function
    table_effects();
    jQuery('.selectpicker').selectpicker();
  }
  ,render: function render(arg) {
    // unregister old ajaxStop handler that's used by other code
    //  old way was to overwrite it 
    $(document).off('ajaxStop');
    return lbs.modHelper.returnResolved(arg);
  }
  , deps: []
  ,fillup:function fillup(list,pageSize){
    var add = pageSize - (list.length % pageSize)
    ,i=-1
    ,ret = [];
    add = (add===pageSize)?0:add;
    add = list.length + add;
    while(++i<add){
      ret.push(list[i]||{});
    }
    return ret;
  }
  , endPoints: {
    userInfo: '/home/user.json'
    ,logout: '/home/logout.json'
    ,login:'/home/login.json'
  }
  , remove: function () {
  }
  , create: function () {
    delete this.debs;
    delete this.create;
  }
  , settings: null
  ,'photo:list' : {
    render : function render(arg){
      this.index=0;
      arg = arg || {};
      var d = arg.defer || jQuery.Deferred();
      var me = this;
      this.otherHandlers = arg.handlers;
      this.forContainer=arg.container;
      this.currentView = arg.view || 'galleryView';
      this.templateHelpers=arg.helpers;
      this.pageSize = arg.pageSize || 8;
      this.settings = arg.settings;
      jQuery.when(
        lbs.modHelper.getMessage(arg.endPoint,false,{})
      ).then(function(msg){
        if(!msg.er){
          me.list = msg.pl;
          me.totalRecords=msg.total;
        }
        me.rerender();
        d.resolve();
      });
      return d.promise();
    }
    ,rerender : function rerender(arg) {
      var me = this;
      arg = arg || {};
      var rowSize = arg.rowSize || 4;
      return lbs.modHelper.getView(this.views[this.currentView])
      .then(function(view){
        lbs.modHelper.setContainer({mod:me,html:Mustache.render(view,{
            list:lbs.basemodule.fillup(me.list.slice(me.index,me.index+me.pageSize),me.pageSize)
            ,total:me.totalRecords
            ,row:lbs.modHelper.isVal({
              obj:{ret:0}
              ,key:'ret'
              ,val:function(pageSize,getIndex){
                return function(){
                  var index = getIndex();//call getIndex only once per line
                  if(index%rowSize===0//(4%4=0,8%4=0,...)
                          &&index!==pageSize){
                    return 0;
                  }
                };
              }(me.pageSize,lbs.modHelper.index({index:1}))
              ,yes:true
              ,no:false
            })
            ,page:lbs.modHelper.isVal({
              obj:{itemSize:true}
              ,key:'itemSize'
              ,val:function(index,pageEnd){
                return function(){
                  if(index()>pageEnd){
                    return true;
                  }
                };
              }(lbs.modHelper.index({index:me.index}),me.index+me.pageSize)
              ,yes:false
              ,no:true
            })
            ,helpers:me.templateHelpers
            ,settings:me.settings
          })
          ,container:me.forContainer});
        lbs.actionHandler({container:me.forContainer,handlers:me.handlers});
        if(me.otherHandlers){
          lbs.actionHandler({container:me.forContainer,handlers:me.otherHandlers});
        }
        me.updateArrows();
      });
    }
    ,movePage : function movePage(arg) {
      arg = arg || {};
      var e = arg.e;
      var direction=-this.pageSize;
      if(jQuery(e.currentTarget).attr('data-direction')==='right'){
        direction = this.pageSize;
      }
      this.index+=direction;
      if(this.index>=this.list.length){
        this.index+=(direction*-1);
      }
      if(this.index<0){
        this.index=0;
      }
      this.rerender();
    }
    ,updateArrows : function updateArrows(arg){
      var $container = jQuery(this.forContainer);
      if(this.index===0){
        $container.find('.idPhotoGaleryArrowContainerLeft').addClass('disabled');
        $container.find('.idPhotoGaleryArrow.left').addClass('disabled');
      }else{
        $container.find('.idPhotoGaleryArrowContainerLeft').removeClass('disabled');
        $container.find('.idPhotoGaleryArrow.left').removeClass('disabled');        
      }
      if(this.index+this.pageSize>=this.list.length){
        $container.find('.idPhotoGaleryArrowContainerRight').addClass('disabled');
        $container.find('.idPhotoGaleryArrow.right').addClass('disabled');
      }else{
        $container.find('.idPhotoGaleryArrowContainerRight').removeClass('disabled');
        $container.find('.idPhotoGaleryArrow.right').removeClass('disabled');        
      }
    }
    ,setSelectedMode : function setSelectedMode(arg){
      arg = arg || {};
      var e = arg.e;
      var $this = jQuery(e.currentTarget);
      if($this.prop('class').indexOf('Clicked')!==-1){
        return;//do nothing, is already clicked
      }
      //remove clicked class from others, @todo: could be better
      $this.parents('.inspectionDisplyModes').find('div')
      .each(function(){
        var $this = jQuery(this),
            classes = $this.prop('class').split(' '),
            i=-1,len=classes.length;
        while(++i<len){
          if(classes[i].indexOf('Clicked')!==-1){
            $this.removeClass(classes[i]);
          }
        }
      });
      $this.addClass($this.prop('class')+'Clicked');//add clicked to this
    }
  }
  ,'general:list' : {
    render : function(arg){
      arg = arg || {};
      this.containerToSet = arg.container;
      this.viewUrl = arg.listView;
      var d = arg.defer || jQuery.Deferred();
      var me = this;
      jQuery.when(
          lbs.modHelper.getView(this.viewUrl)
          ,lbs.modHelper.getMessage(arg.listEndPoint,false,{})
      )
      .then(function(view,msg){
        me.list=msg.pl;
        var data = {
          items:(arg.withPadding===false)?me.list
            :lbs.basemodule.fillup(me.list.slice(me.index,me.index+me.pageSize),me.pageSize)
        };
        lbs.util.merge(arg,data);
        lbs.modHelper.setContainer({
          mod:me
          ,html:Mustache.render(view,data)
          ,container:me.containerToSet});
        d.resolve();
      });
      return d.promise();
    }
    ,parentRender : function(arg){
      var arg = arg || {};
      var d = arg.defer || jQuery.Deferred();
      var me = this;
      var route = jQuery.param.fragment();
      var parentRender = (this.parent && typeof this.parent.render === 'function')?this.parent.render(arg):jQuery.when();
      var parentContainer = me.container||arg.data.parentContainer;
      parentRender.then(function(){
        //load child (list module) and view for this module 
        return jQuery.when(
          (arg.listMod)?lbs.modHelper.getMod(arg.listMod):null
          ,lbs.modHelper.getView(arg.mainView)
        );
      })
      .then(function(listMod,view){
        var data = (me.routeParams && me.routeParams[route])?me.routeParams[route]:{};
        //add passed extras to data
        lbs.util.merge(arg.data,data);
        lbs.modHelper.setContainer({mod:me,html:Mustache.render(
            view,data),container:parentContainer});
        //render the list
        return (listMod!==null)?listMod.render(data):null;
      }).then(function(res){
        lbs.actionHandler({
          container:parentContainer
          ,handlers:me.handlers
        });
        d.resolve();
      });
      return d.promise();
    }
  }
};
lbs.modules['/global:modal'] = {
  deps : []
  ,createdBy:false
  ,create : function create(){
    lbs.globalModal = this;
    delete this.deps;
    delete this.create;
  }
  ,render : function render(arg){
    arg = arg || {};
    var d = arg.defer || jQuery.Deferred();
    var me = this;
    this.createdBy=arg.createdBy;
    lbs.modHelper.getView('/commons/views/modal.html')
    .then(function(view){
      //@todo: look what happends on remove and setcontainer again will call remove or not
      lbs.modHelper.setContainer({mod:me,html:Mustache.render(view,view),container:arg.container});
      jQuery(arg.container).modal();//@todo: optional modal options could be passed in arg
      return arg.view?lbs.modHelper.getView(arg.view):false;
    })
    .then(function(view){
      if(view){
        lbs.modHelper.setContainer({mod:me,html:Mustache.render(view,arg.templateData),container:arg.container});
      }
      //lbs.actionHandler({container:me.container,handlers:me.handlers});//@todo: pass action handlers
      d.resolve();
    });
    return d.promise();
  }
  ,remove : function remove(){
    if(this.createdBy && (typeof this.createdBy === 'function')){
      this.createdBy.remove();
    }
  }
};


lbs.globalHandlers = {
  bbqUpdate: function bbqUpdate(e,url){
    var script_source_url;
    if(e){
      script_source_url = e.currentTarget.getAttribute('data-linkto');
      e.preventDefault();      
    }else{
      script_source_url = url;
    }
    if (script_source_url === "/home") {
      $.bbq.pushState('#');
    }
    else if (script_source_url === "/workspace/welcome") {
      $.bbq.pushState('#' + '/workspace/welcome');
    }
    else {
      $.bbq.pushState('#' + script_source_url);
    }
  }
};
lbs.actionHandler = function (arg) {  
  var container = arg.container,
          handlers = arg.handlers;
  var handler = function (attr) {
    return function (e) {
      var action = e.currentTarget.getAttribute(attr);
      action = action || '';
      action = action.split(',');
      var i = -1,len=action.length;
      while(++i<len){
        if (typeof handlers[action[i]] === 'function') {
          handlers[action[i]](e);
        }       
      }
    };
  };
  $(container).find("[data-action-click]").on('click', handler('data-action-click'));
  $(container).find("[data-action-change]").on('change', handler('data-action-change'));
};

lbs.binder = {
  BoundValue: (function () {
    var BoundValue = function (arg) {
      this.element = arg.element;
      this.toMutate = arg.toMutate;
      this.objToMutate = arg.objToMutate;
      var me = this;
      jQuery(this.element).on('change', function (e) {
        me.change(e);
      });
      //if updateUI is not called within one second then its assumed you want
      //  to bind the js object to the values of the html elements
      //  if updateUI is called within one second then you want to bind the 
      //  html element to the object and this timeout is cancelled
      this.initialBind = setTimeout(function(){
        me.change({target:this.element});
      },1000);
    };
    BoundValue.create = function (arg) {
      if (arg.element.type === 'checkbox' &&
              Object.prototype.toString.call(arg.objToMutate[arg.toMuate]).indexOf('Array')) {
        return new BoundList(arg);
      }
      return new BoundValue(arg);
    };//@todo: for later use if we have other types besides objects that have value and onchange
    BoundValue.prototype.change = function (e) {
      this.objToMutate[this.toMutate] = jQuery(e.target).val();
    };
    BoundValue.prototype.updateUI = function updateUI(){
      clearTimeout(this.initialBind);
      if(this.element.tagName==='SELECT'){
        lbs.util.setSelect(this.element,this.objToMutate[this.toMutate]);
      }
      jQuery(this.element).val(this.objToMutate[this.toMutate]);
    };
    BoundValue.prototype.destroy = function () {
      jQuery(this.element).off();
    };
    var BoundList = function BoundList(arg) {
      BoundValue.call(this, arg);
    };
    BoundList.prototype = Object.create(BoundValue.prototype);
    BoundList.prototype.constructor = BoundList;
    BoundList.prototype.change = function (e) {
      var index;
      if (e.target.checked) {
        this.objToMutate[this.toMutate].push(e.target.value);
      } else {
        index = this.objToMutate[this.toMutate].indexOf(e.target.value);
        if (index !== -1) {
          this.objToMutate[this.toMutate].splice(index, 1);
        }
      }
    };
    return BoundValue;
  }())
  , bind: function (container, object,nameSpace) {
    var boundVals = [];
    jQuery(container).find('[data-bind]').each(function () {
      var item = this.getAttribute('data-bind').split('.');
      var itemPath = item.slice(1, item.length - 1);
      var toMutate = item.slice(item.length - 1)[0];
      var objToMutate = lbs.util.getMember(object, itemPath);
      if(nameSpace && (nameSpace !== item[0])){
        return 1;
      }
      if (objToMutate === undefined) {
        throw new Error('Unable to get object to bind to.');
      }
      boundVals.push(lbs.binder.BoundValue.create({
        element: this
        , toMutate: toMutate
        , objToMutate: objToMutate
      }));
    });
    return boundVals;
  }
  , unbind: function (boundValues) {
    var i = -1, len;
    len = boundValues.length ? boundValues.length : 0;
    while (++i < len) {
      boundValues[i].destroy();
    }
  }
};

lbs.util = {
  getMember: function getMember(o, memberNames) {
    var i = -1, len = memberNames.length;
    while (++i < len) {
      o = o[memberNames[i]];
      if (o === undefined) {
        break;
      }
    }
    return o;
  }
  ,sortMethod: function (asc, key) {
    var direction = asc ? 1 : -1;
    return function (a, b) {
      return (a[key] - b[key]) * direction;
    };
  }
  ,merge : function (source, target){
    //adds/overwrites source members on target
    var key;
    for(key in source){
      if(Object.hasOwnProperty.call(source,key)){
        target[key]=source[key];
      }
    }
  }
  ,setSelect : function setSelect(el,val){
    var options = el.options,i=-1,len=options.length,selected,
            $el=jQuery(el);
    while(++i<len){
      selected = (options[i].value===val);
      if(Object.prototype.toString.call(val)==='[object Array]'){
        selected = (val.indexOf(options[i].value)!==-1);
      }
      options[i].selected = selected;
    }
    if($el.hasClass('selectpicker')){
      $el.selectpicker('render');
    }
  }
  ,find : function (arg){
    var arr = arg.arr,
            key = arg.key,
            val = arg.val,
            index = arg.index || 0,
            i = index - 1,
            len = arr.length,
            multiple = arg.multiple,
            ret = multiple?[]:-1;
    while(++i<len){
      if(arr[i][key]===val){
        if(multiple){
          ret.push(i);
        }else{
          return i;
        }
      }
    }
    return ret;
  }
};

lbs.modHelper = function (arg) {
  this.url;
  this.type;
  this.start;
  this.cache = lbs.cache;
  this.d;
};

lbs.modHelper.returnResolved = function returnResolved(ret) {
  var d = jQuery.Deferred();
  setTimeout(function () {
    d.resolve(ret);
  });
  return d.promise();
};
(function (loadedMods) {
  lbs.modHelper.setContainer = function setContainer(arg) {
    var currentMod = loadedMods[arg.container];
    if (currentMod && arg.mod !== currentMod && (typeof currentMod.remove === 'function')) {
      //current module occupying the container is not the module trying to set html
      //  it has a remove method so call that so it can clean up
      currentMod.remove();
    }
    jQuery(arg.container).html(arg.html);
    loadedMods[arg.container] = arg.mod;
  };
}({}));//set loadedMods to an empty object

lbs.modHelper.getView = function (location, cache) {
  cache = (cache === false) ? false : true;
  var fetcher = new lbs.modHelper();
  return fetcher.fetch({
    url: location
    , cache: cache
    , type: 'view'
  });
};
lbs.modHelper.getUser = function (arg) {
  arg = arg || {};
  var recoverOptions = arg.recoverOptions || {};
  recoverOptions.message = recoverOptions.message || 'You have to log in to continue';//@todo: this should be passed and defined in a lbs.settings.messages
  recoverOptions.persist = (recoverOptions.persist === false) ? false : true;
  var d = jQuery.Deferred();
  lbs.modHelper.getMod('/workspace/login')
          .then(function () {
            return lbs.workspace.handleLogin(recoverOptions);
          }).then(function (message) {
    d.resolve();
  });
  return d.promise();
};
lbs.modHelper.recover = function recover(arg) {
  if (arg && arg.msg && arg.msg.responseJSON && arg.msg.responseJSON.er) {
    if (arg.msg.responseJSON.er.ec === 8401
            || arg.msg.responseJSON.er.ec === 8404) {
      return lbs.modHelper.getUser(arg);
    }
  }
  if (arg && arg.msg && arg.msg.readyState===0) {
    console.log('do something for not connected',arg);
    alert('Ready state of xhr is 0, this means youre disconnected. sleek looking modal isnt implemented yet\nPlease start your server.');
    //@todo: handle a disconnected state
  }if (arg && arg.msg && arg.msg.status===500) {
    alert('Server error: sleek looking modal isnt implemented yet\nPlease check your server settings.\nLook in the terminal that started your lbs server for error detils.');
  }else {
    console.log('Unkown failure:',arg);
    alert('Unknown failure, look in the browser console for reason why it failed.\nIt should contain an object with more info having more detial about the failure.');
  }
  //@todo: should handle disconnected or not authorised
  var d = jQuery.Deferred();
  setTimeout(function () {
    console.log('rejecting');
    d.reject('Unable to recover or recover not implemented.');
  });
  return d.promise();
};
lbs.modHelper.getMessage = function (location, cache, recoverOptions, httpType, data) {
  //@todo: here is where a module specific cache can be useful so fetcher can add it for you
  var fetcher = new lbs.modHelper();
  var d = jQuery.Deferred();
  fetcher.fetch({
    url: location
    , cache: (cache === true) ? true : false//for messages the default is not to cache
    , type: 'endpoint'
    , httpType: httpType || 'GET'
    , data: data || {}
  }).then(function success(msg) {
    d.resolve(msg);
  }, function reject(msg) {
    if (!recoverOptions) {
      d.reject(msg);
      return;
    }
    lbs.modHelper.recover({msg: msg, location: location, recoverOptions: recoverOptions})
            .then(function () {
              lbs.modHelper.getMessage(location, cache, false, httpType, data)
                      .then(function resolve(msg) {
                        d.resolve(msg);
                      }, function reject(reason) {
                        d.reject(reason);
                      });
            }, function reject(reason) {
              d.reject(reason);
            });
  });
  return d.promise();
};
lbs.modHelper.getScriptFromUrl = function (arg) {
  var defer = jQuery.Deferred();
  var script;
  script = document.createElement('script');
  script.onload = function (e) {
    defer.resolve(arg);
  };
  script.onerror = function (e) {
    defer.reject('cannot load this.');
  };
  script.src = arg.url;
  document.head.appendChild(script);
  return defer.promise();
};
lbs.modHelper.getCssFromUrl = function (arg) {
  var defer = jQuery.Deferred();
  var css;
  css = document.createElement('link');
  css.onload = function (e) {
    defer.resolve(arg);
  };
  css.onerror = function (e) {
    defer.reject('cannot load this.');
  };
  css.rel = 'stylesheet';
  css.href = arg.url;
  document.head.appendChild(css);
  return defer.promise();
};
lbs.modHelper.prototype.fetch = function (arg) {
  this.defer = jQuery.Deferred();
  var me = this;
  this.start = new Date().getTime();
  this.type = arg.type || 'mod';
  this.url = this.location = arg.url;//@todo: not taking GET data into account
  this.cache = (arg.cache === false) ? false : this.cache;
  this.container = arg.container || false;//use no cache if indicated
  this.response;
  if (this.type === 'mod') {
    return this.getScript();
    return this.defer.promise();
  }
  if ((this.cache === false) || !this.cache[this.location]) {
    $.ajax({
      url: this.url
      , data: arg.data || {}
      , type: arg.httpType || 'GET'
    }).then(function (res) {
      if (me.cache) {
        me.cache[this.url] = me.response = res;
      } else {
        me.response = res;
      }
      me.gotResponse();
    }).fail(function (reason) {
      //@todo: what if it fails, how to handle (we can do a callback or return a failed promise)
      me.defer.reject(reason);
    });
  } else {
    this.response = me.cache[this.url];
    this.gotResponse();
  }
  return this.defer.promise();
};
lbs.modHelper.createIsSelected = function createIsSelected(val,key) {
  //depending on what val is (Object.prototype.toString.call(val))==="[object Array]" return a different function
  if(Object.prototype.toString.call(val)==="[object Array]"){
    return function () {
      var listVal= (key)?lbs.util.getMember(this,key.split('.')):this;
      //val could be null or undefined, need to convert to the same type but cannot use toString() on null or undefined
      //  !!! note that the array named val has to contain strings
      listVal = ((listVal || listVal===0 || listVal===false) 
              && typeof listVal.toString==='function')?listVal.toString():listVal;
      return  val.indexOf(listVal)!==-1 ? 'selected' : '';
    };
  }
  return function () {
    var listVal= (key)?lbs.util.getMember(this,key.split('.')):this;
    //val could be null or undefined, need to convert to the same type but cannot use toString() on null or undefined
    listVal = ((listVal || listVal===0 || listVal===false) 
            && typeof listVal.toString==='function')?listVal.toString():listVal;
    val = ((val || val===0 || val===false) 
            && typeof val.toString === 'function')?val.toString():val;
    return  listVal === val ? 'selected' : '';
  };
};
lbs.modHelper.isChecked = function isChecked(entityList, key) {
  return function () {
    return entityList.indexOf(this[key].toString()) > -1 ? 'checked' : '';
  };
};
lbs.modHelper.isVal = function isVal(arg){
  return function(){
    arg.obj = arg.obj || this;
    var key = (typeof arg.key === 'function')?arg.key():arg.key,
    val = (typeof arg.val === 'function')?arg.val():arg.val;
    if(arg.obj[key] === val){
      return arg.yes;
    }
    return arg.no;
  };
};
lbs.modHelper.index = function index(arg){
  arg = arg || {};
  var index = arg.index || 0;
  return function(){
    return index++;
  };
};
//get the global template for modal
lbs.modHelper.getView('/commons/views/modal.html');
lbs.settings = {};
lbs.settings.messages = {};
lbs.settings.messages.validate = {};
lbs.settings.messages.validate.service = {
  'NAME_EMPTY': 'Service name cannot be empty'
  , 'STANDARD_PRICE_NOT_NUMBER': 'Service price has to be a number.'
  , 'STANDARD_PRICE_NOT_NUMBER': 'Standard price has to be a number.'
  , 'DISCOUNT_PRICE_NOT_NUMBER': 'Discount price has to be a number.'
};
lbs.settings.views = {
    defaultTemplate:'/home/home.html'
    ,masterTemplate:"/home/master.html"
};

lbs.validator = (function () {
  var BaseValidator = function () {

  };
  BaseValidator.create = function (type) {
    if (typeof types[type] === 'function') {
      return new types[type]();
    }
  };
  BaseValidator.bindCss = function bindCss(arg){
    $elems = $(arg.container).find('[data-validate]').each(function(){
      
    });
  };
  
  BaseValidator.prototype.rangeString = function rangeString(val, min, max) {
    var evals = [], i = -1, len, ret = true;
    val = val || '';
    if (min !== undefined) {
      evals.push(val.replace(/\s/igm, '').length >= min);
    }
    if (max !== undefined) {
      evals.push(val.replace(/\s/igm, '').length <= max);
    }
    len = evals.length;
    while (++i < len) {
      ret = ret && evals[i];
    }
    return ret;
  };
  BaseValidator.prototype.rangeNumber = function (val, min, max) {
    var evals = [], i = -1, len, ret = true, numVal;
    numVal = parseFloat(val, 10);
    evals.push(!isNaN(numVal));
    if (min !== undefined) {
      evals.push(numVal >= min);
    }
    if (max !== undefined) {
      evals.push(numVal <= max);
    }
    len = evals.length;
    while (++i < len) {
      ret = ret && evals[i];
    }
    return ret;
  };

  var ServiceValidator = function (arg) {
    BaseValidator.call(this, arg);
  };
  ServiceValidator.prototype = Object.create(BaseValidator.prototype);
  ServiceValidator.prototype.constructor = ServiceValidator;
  ServiceValidator.prototype.serviceName = function (arg) {
    if (!this.rangeString(arg.val, 1)) {
      return lbs.settings.messages.validate.service.NAME_EMPTY;
    }
    return true;
  };
  ServiceValidator.prototype.standardServicePrice = function (arg) {
    if(this.rangeString(arg.val,0,0)){
      //ok for the string to be empty
      return true;
    }
    if (!this.rangeNumber(arg.val)) {
      return lbs.settings.messages.validate.service.STANDARD_PRICE_NOT_NUMBER;
    }
    return true;
  };
  ServiceValidator.prototype.standardPricing = function (arg) {
    if (this.standardServicePrice(arg)!==true) {
      return lbs.settings.messages.validate.service.DISCOUNT_PRICE_NOT_NUMBER;
    }
    return true;
  };
  ServiceValidator.prototype.fields = {
    serviceName : ServiceValidator.prototype.serviceName
    , standardServicePrice : ServiceValidator.prototype.standardServicePrice
    , standardPricing : ServiceValidator.prototype.standardPricing
  };
  ServiceValidator.prototype.validate = function validate(arg) {
    var arg = arg || {};
    var key, hasOwn = Object.prototype.hasOwnProperty, validates = [], i = -1, len, ret = [];
    var fields = arg.fields || this.fields;
    for (key in fields) {
      if (hasOwn.call(fields, key)) {
        validates.push(this[key]({val: arg.val[key]}));
      }
    }
    len = validates.length;
    while (++i < len) {
      if (validates[i] !== true) {
        ret.push(validates[i]);
      }
    }
    return (ret.length === 0) ? true : ret;
  };
  
  //@todo: currently not working, the validator should go on the input and this
  //  should find the closest form group parent
  //  then set the right classes when the value changes
  var CssValidator = function CssValidator(arg){
    var path = this.getAttribute('data-validate').split('.');
    this.entityName = path[0];
    this.valProp = path[0];//@todo: simple check for service.something, could be service.servicePoints[nr].something
    this.entity = arg.entity;
    this.validator = BaseValidator.create();
    this.element = arg.element;
    var me = this;//@todo, assuming only a div with a textbox and a glypicon??
    $(this.element).on('change',function(e){
      me.change(e);
    });
  };
  CssValidator.prototype.change = function change(e){
    
  };

  var types = {
    'service': ServiceValidator
  };
  return BaseValidator;
}());


lbs.modHelper.getMod = function (route) {
  //empty route defaults to /
//  route = (route==='')?'/':route;
  var f = new lbs.modHelper();
  var mod;
  var deps;
  var i = -1, len;
  var d = jQuery.Deferred();
  var promises = [];
  f.fetch({
    url: route
  }).then(function (route) {
    mod = lbs.modules[route.routeurl];
    if (!(mod && mod.deps)) {
      d.resolve(mod);
    }
    deps = mod.deps;
    len = (deps && deps.length) ? deps.length : 0;
    while (++i < len) {
      promises.push(lbs.modHelper.getMod(deps[i]));
    }
    jQuery.when.apply(jQuery, promises).then(function () {
      if (mod && (typeof mod.create === 'function')) {
        mod.create();
      }
      d.resolve(mod);
    });
  });
  return d.promise();
};

lbs.modHelper.prototype.getScript = function getScript() {
  //mods don't work with cache, they eiter exist or they dont
  this.route = lbs.routes[this.url];
  if (!this.route) {
    throw new Error('Unknown route:' + this.url);
  }
  var mod = lbs.modules[this.url];
  this.location = this.route.location;
  var me = this;
  var script;
  if (!mod) {
    console.log('loading script:',this.url);
    script = document.createElement('script');
    script.onload = function (e) {
      me.route.routeurl = me.url;
      me.defer.resolve(me.route);
    };
    script.src = this.location;
    document.head.appendChild(script);
  } else {
    this.route.routeurl = this.url;
    this.defer.resolve(this.route);
  }
  return this.defer.promise();
};

lbs.modHelper.prototype.gotResponse = function gotResponse() {
  this.defer.resolve(this.response);
};

//center elements in their corresponding containers on the home page

function v_aligner(){//this function mainly take care of aligning DiVs on the center of the page


    var	leftContainPositionLeft,leftContainPositionTop,rightContainPositionLeft,
        halfSeparationLine,rightContainPositionTop, otherLoginMethodsLeft,
        searchPositionRight,width,regBoxTop,regBoxLeft = 0;

    width =$(window).width();

    if(width>390)
    {

        if(width<570)
        {
            rightContainPositionLeft=($('#home_right_container').width() - $('#home_login_form').width())/2;
            otherLoginMethodsLeft=($('#home_right_container').width() - $('#otherLoginMethods').width())/2 +17;
            rightContainPositionTop=($('#home_right_container').height()-$('#home_login_form').height())/2 - 20;


        }
        else
        {
            halfSeparationLine=$('#home_separation_line')/2;

            rightContainPositionLeft=($('#home_right_container').width() - $('#home_login_form').width())/2-15;
            /*remove 20 px to push it up a litle*/
            rightContainPositionTop=($('#home_right_container').height()-$('#home_login_form').height())/2 - 20;

            otherLoginMethodsLeft=($('#home_right_container').width() - $('#otherLoginMethods').width())/2 -15;

            searchPositionRight = ($('#home_right_container').width() - $('#home_login_form').width())/2-15;
            $('#home_search').css({"position":"absolute","top":0,"left":searchPositionRight});
        }


        leftContainPositionLeft=($('#home_left_container').width() - $('#home_left_contain').width())/2;
        leftContainPositionTop=($('#home_left_container').height()-$('#home_left_contain').height())/2;

        regBoxTop=($('.notHomeMainContainer').height()-$('#regBox').height())/2;
        regBoxLeft=($('.notHomeMainContainer').width() - $('#regBox').width())/2;

        $('#home_left_contain').css({"position":"absolute","top":leftContainPositionTop,"left":leftContainPositionLeft});
        $('#home_login_form').css({"position":"absolute","top":rightContainPositionTop,"left":rightContainPositionLeft});
        $('#otherLoginMethods').css({"position":"absolute","bottom":"15px","left":otherLoginMethodsLeft});

        $('#regBox').css({"position":"absolute","top":regBoxTop,"left":regBoxLeft});

    }

}/*end of v_aligner function definition*/




//run v_align on browser resize
$(window).resize(function(){

    //v_aligner();

});

//end of center elements in their corresponding containers on the home page



//end of go to home
//show corresponding page when clicking on the submenu item on the side navigation

var updateWorkSpaceRightContainerOnClick = function (element_attr, script_source_url) {
    $(element_attr).click(function (e) {
        if(script_source_url === "/home/master"){
            $.bbq.pushState('#');
        }
        else if (script_source_url === "/workspace/welcome"){
            $.bbq.pushState('#' + '/workspace/welcome');
        }
        else{
            $.bbq.pushState('#' + script_source_url);
        }
        e.preventDefault();
    });
};

//bbq history script

// Be sure to bind to the "hashchange" event on document.ready, not
// before, or else it may fail in IE6/7. This limitation may be
// removed in a future revision.
var masterPageStatus = false;

$(function () {



// Override the default behavior of all `a` elements so that, when
// clicked, their `href` value is pushed onto the history hash
// instead of being navigated to directly.



// Bind a callback that executes when document.location.hash changes.
//  could improve routing, check lbs.routes where a module/controller would
//  register for a url
  $(window).bind("hashchange", function (e) {
// In jQuery 1.4, use e.getState( "url" );
    var routeMod = function (url) {
      //save when the url was requested (user clicked)
      var start = new Date().getTime();
      return lbs.modHelper.getMod(url).then(function (mod) {
        var mod = lbs.util.getMember(window, lbs.routes[url].mod.split('.'));
        //there maybe other mods competing to render in this container, see if current is the latest
        if (mod && (mod.container)) {
          lbs.loadingMods[mod.container] = lbs.loadingMods[mod.container] || [];
          lbs.loadingMods[mod.container].push({start: start});
          lbs.loadingMods[mod.container].sort(lbs.util.sortMethod(false, 'start'));
          if (lbs.loadingMods[mod.container][0].start === start) {
            mod.render().then(function(){
              lbs.basemodule.pageComplete();
            });
}
        }
      });
    };
    var oldMethod = function () {
      if (urlsplit.length > 3) {
        $.getScript(url + '.js');
      }
      else if (url === '') {
        $.getScript('/home/master.js');
      }
      else if (url === '/workspace/welcome') {

        $.getScript('/workspace/welcome/master.js');
      }
      else if (url === '/home/userRegistration') {
        $.getScript('/home/userRegistration.js');
      }
      else if (urlsplit[1] === 'publishing') {
        // $.getScript('/publishing/publishing.js')
      }
    };
    var url = $.param.fragment();
    //empty route defaults to /home
    url = (url==='')?'/home':url;
    var urlsplit = url.split('/');
    if (lbs.routes[url]) {
      console.log('going to use router for url',url);
      routeMod(url);
      return;
    } else {
      lbs.modHelper.getScriptFromUrl({
        url: urlsplit.slice(0, urlsplit.length - 1).join('/') + '/main.js'
        , location: url
      }).then(function resolve(msg) {
        routeMod(msg.location);
      }, function reject() {
        console.log('using old method for url:',url);
        oldMethod();
      });
      return;
    }
  });
  // Since the event is only triggered when the hash changes, we need
  // to trigger the event now, to handle the hash the page may have
  // loaded with.
  $(window).trigger("hashchange");
}); // JavaScript Document




//end of bbq history script



//end of show corresponding page when clicking on the submenu item on the side navigation

//Slide the menu items/subitems up and down

function slideEffectsHandler() {
    detailPageSlideHandler();
    leftNavMenuItemSlideHandler();
}

function detailPageSlideHandler() {

    $('.detailPageSlideDownBoxes .detailPageUserIntroBox:not(:first)').find('.detailPageUserIntroBoxBody').slideUp('fast');
    $(".detailPageUserIntroBoxHeader").click(function (e) {

        if (!$(this).parents().hasClass('personalHomeTables')) {
            $(this).parent().siblings().find('.detailPageUserIntroBoxBody').slideUp('fast');
        }


        if ($(this).next().is(":hidden")) {

            $(this).next().slideDown("fast");
        } else {

            $(this).next().slideUp('fast');
        }
        e.preventDefault();
    });
}

function leftNavMenuItemSlideHandler() {
  console.log('old slide handler');return;


    $(".service_name").click(function () {


        menuClickedID = $(this).attr("id");
        //alert(menuClickedID);
        $(".nav-menu").find('.detail_frame').css("display", "none");
        $(".nav-menu").find('.nav_list_bg').css("background", "none");
        $(".nav-menu").find('.service_name').css("border-bottom", "1px dashed #ebebeb");
        if ($("#left_nav_mini").is(':hidden'))/*to avoid sliding on the small nav*/
        {
            if ($(this).next().is(":hidden")) {

                $(this).next().slideDown("fast");
                $(this).parent(this).css({
                    "background": "url(../commons/images/task_bg_03.jpg) no-repeat left top",
                    "background-color": "#FFFFFF"
                });
                $(this).css("border-bottom", "none");
            } else {

                $(this).next().hide('fast');
                $(this).parent(this).css("background", "none");
                $(this).css("border-bottom", "1px dashed #ebebeb");
                // e.preventDefault();
            }
        }

    });
    $(".details").click(highLightSelectedSubmunuItem);
}


//hight selected submenu
var highLightSelectedSubmunuItem = function (e) {
  console.log('old highlight, do nothing');return;

    $(".nav-menu").find(".details a").css({"color": "#B5B5B5", "font-weight": "100"});
    $(".nav-menu").find('.details img').css("visibility", "hidden");
    $(this).find('img').css("visibility", "visible");
    $(this).find("a").css({"color": "#136FD3", "font-weight": "bold"});
    $(".navbar-toggle").trigger('click');
    e.preventDefault();
};


// end of Slide the menu items/subitems up and down


//handles effects on the table across all personal workspaces
function table_effects() {

    paddingEffecfts();
    /* swap backgroug for the table header on selection and sorting*/
    $('.table .row:first-child .cell:nth-child(3)').addClass('swapBg');
    $('.Swap').click(function () {

        if ($(this).hasClass('swapBg') || $(this).hasClass('swapBg2')) {
            $(this).toggleClass('swapBg swapBg2');
        }
        else {
            $(this).addClass('swapBg');
            $(this).siblings().removeClass('swapBg');
            $(this).siblings().removeClass('swapBg2');
        }


    });
}


// end of handles effects on the table across all personal workspaces	


function paddingEffecfts() {

    $("#pagging button:nth-child(2)>a").addClass('activeClick');
    /*hover effect for table pagging*/

    $("#pagging button a").hover(
        function (e) {

            /*$(this).css({"color":"white","background":"gray"});*/
            $(this).addClass('activeHover');
            e.preventDefault();
        },
        function (e) {

            $(this).removeClass('activeHover');
            e.preventDefault();
        }
    );
    $("#pagging button a").click(function (e) {

        $(this).addClass('activeClick');
        /*just adding class isn't working , so i apply effect using css and use addClass for the if on hover*/
        $(this).parent().siblings().find('a').removeClass('activeClick');
        e.preventDefault();
    });
}
//end of pagging effects


//  handles the width of the right container of the personal work space
//as well as hidding and/or showing the large or small navigation bar on when you click on the 
//hide me button or when the size of the screen is less than 960px 


function sidebar() {

    var right_container_width, right_container_width_for_mini = 0;
    width = $(window).width();
    //left nav display
    $(".clickMe").click(function () {

        if (width > 768) {
            right_container_width = ($(".wrapper").width() - $("#left_nav").width()) + 25;
            $(".leftNavigations #left_nav_mini").css("display", "none");
            $(".leftNavigations #left_nav").css("display", "block");
            $(".leftNavigations #left_nav").find('.nav_list_bg').css("display", "block");
            $('#right_container').css({"width": right_container_width, "": ""});
        }

        $('#right_container').addClass('menu-expand');
    });
    //left nav mini display
    $(".clickMeHide").click(function () {
        right_container_width_for_mini = ($(".wrapper").width() - $("#left_nav_mini").width()) + 25;
        $(".leftNavigations #left_nav_mini").css("display", "block");
        $(".leftNavigations #left_nav").css("display", "none");
        $('.leftNavigations .nav_list_bg').css({"display": "none", "": ""});
        $('#right_container').css({"width": right_container_width_for_mini, "": ""});
        showSideFrame();
        $('#right_container').removeClass('menu-expand');
    });
    sidebarSwaper();
    //ajust width on window resize
    $(window).resize(function () {

        sidebarSwaper();
    });
    // profile hide and show
    $("#Profile_arrow_up").click(function () {


        $("#profile").css("display", "none");
        $(this).css("display", "none");
        $("#Profile_arrow_down").css("display", "block");
    });
    $("#Profile_arrow_down").click(function () {
        $("#profile").css("display", "block");
        $(this).css("display", "none");
        $("#Profile_arrow_up").css("display", "block");
    });
}


//display side frame on the small navigation
function showSideFrame() {
    $(".service_icon").hover(function () {

            $(this).find(".leftNavigations .nav_list_bg").css("display", "block");
            $(this).find("..leftNavigations .nav_list_bg").find('.detail_frame').css("display", "block");
            /*	$(this).find(".nav_list_bg").addClass('miniHoverBg');*/

            //hide frames when one is selected
            $(this).siblings().find(".leftNavigations .nav_list_bg").css("display", "none");
        },
        function () {

            $(this).find(".leftNavigations .nav_list_bg").css("display", "none");
        });
}


function sidebarSwaper() {


    var width = $(window).width();
    showSideFrame();
    if (width >= 991) {
        $(".leftNavigations #left_nav").css("display", "block");
        $(".leftNavigations #left_nav_mini").css("display", "none");
    }
    if (width < 991) {


        if ($(".leftNavigations #left_nav_mini").is(':hidden')) {

            $(".leftNavigations #left_nav_mini").css("display", "block");
            $('.leftNavigations .nav_list_bg').css({"display": "none", "": ""});
            $(".leftNavigations #left_nav").css("display", "none");
            $('.leftNavigations .nav_list_bg').hover(function (e) {
                $(this).css({"display": "block", "position": "absolute", "left": $("#left_nav_mini").width(), "top": "0"});
            });
        }

        if (width < 760) {
            $('#right_container').width($(".wrapper").width() - $("#left_nav_mini").width() + 25);
        }
        else if (width < 560) {
            $('#right_container').width($(".wrapper").width() - $("#left_nav_mini").width() + 20);
        }
        else {
            $('#right_container').width($(".wrapper").width() - $("#left_nav_mini").width() + 20);
        }


    }
    else {
        if ($("#left_nav").is(':hidden')) {

            $("#left_nav").css("display", "block");
            $('.nav_list_bg').css({"display": "block", "": ""});
            $("#left_nav_mini").css("display", "none");
        }
        $('#right_container').width($(".wrapper").width() - $("#left_nav").width() + 25);
    }


}


//end of  handles the width of the right container of the personla work space 
//as well as hidding and/or showing the large or small navigation bar on when you click on the 
//hide me button or when the size of the screen is less than 960px 


//highlight the corresponding part on the operation procedure indication bar: enter user name, password reset email, reset password form and reset complete

var ShiftOperationIndicatorBar = function (element) {
    $(element).addClass("forgotPwProcedureIndicator");
    $(element).siblings().removeClass("forgotPwProcedureIndicator");
};


//highlight the corresponding part on the operation procedure indication bar: enter user name, password reset email, reset password form and reset complete





//galery slider


var idphotoGalerySlider = function(){

    $('.right').addClass('idphotoGaleryClickRight');

    $('#idphotoGaleryContainNext').addClass('displayNone');

    $('.idPhotoGalery .left').click(function(e) {
        if($('#idphotoGaleryContain').is(':hidden')){


            $('#idphotoGaleryContainNext').css('display','none');
            $('#idphotoGaleryContain').css('display','block');
            $('.right').addClass('idphotoGaleryClickRight');
            $('.left').removeClass('idphotoGaleryClickLeft');
        }

    });

    $('.idPhotoGalery .right').click(function(e) {


        if($('#idphotoGaleryContainNext').is(':hidden')){


            $('#idphotoGaleryContainNext').css('display','block');


            $('#idphotoGaleryContain').css('display','none');

            $('.left').addClass('idphotoGaleryClickLeft');

            $('.right').removeClass('idphotoGaleryClickRight');

        }

    });

};


// end of galery slider



//comment section likes

        var markAsLiked = function(){

                $('.commentSection .likes').click(function(e, cb){
                    e.preventDefault();

                    $(this).addClass('specialBlue');



                    $(this).next('.numberOfLikes').text( parseInt( $(this).next('.numberOfLikes').text()) + 1);


                });

        };



//end of comment section likes



//enable comments


    var showCommentTextArea = function (){


        $('.replyToComment').click(function(){

            $('.commentReplyBox').css('display','block');

        });




    };





// end of enable comments











//counter
var countDown = function (callback) {
  var doCountUpdate = function () {
        $('em.countDown').each(function () {
            var count = parseInt($(this).html());
            if (count !== 1) {
                $(this).html(count - 1);
            }else{
              if(callback && (typeof callback === 'function')){
                callback();
              }
            }
        });
    };
    // Schedule the update to happen once every second
    setInterval(doCountUpdate, 1000);
};


//indicates  how stong a password is, when typing it on the form	
function passWordStrengh() {
    $("ul.strength").css("display", "none");
    $("#password").keyup(function () {
        $("ul.strength").css("display", "block");
        var input = $(this).val();
        var res = strongCheck(input);
        if (res <= 0) {
            $('#pwStrengthComment').html("密码太短了!");
            $("ul.strength li").css("background-color", "#ddd");
        }
        else if (res == 1) {
            $('#pwStrengthComment').html("弱!");
            $("ul.strength li").css("background-color", "#ddd");
            $("ul.strength li.1").css("background-color", "#F22");
        }
        else if (res == 2) {
            $('#pwStrengthComment').html("中!");
            $("ul.strength li").css("background-color", "#ddd");
            for (var i = 1; i <= res; i++) {
                $("ul.strength li." + i).css("background-color", "#FF6922");
            }
        }
        else if (res == 3) {
            $('#pwStrengthComment').html("强!");
            $("ul.strength li").css("background-color", "#ddd");
            for (var i = 1; i <= res; i++) {
                $("ul.strength li." + i).css("background-color", "#FFE422");
            }
        }
        else if (res == 4) {
            $("ul.strength li").css("background-color", "#ddd");
            $('#pwStrengthComment').html("强!");
            for (var i = 1; i <= res; i++) {
                $("ul.strength li." + i).css("background-color", "#A7E623");
            }
        }


    });
}

// end of indicates  how stong a password is, when typing it on the form

// end of email validation		

function strongCheck(password) {

    var strength = 0;
    //if the password length is less than 6, return message.
    if (password.length < 6) {
        return 0;
    }
    else {
        strength += 1;
        //if password contains both lower and uppercase characters, increase strength value
        if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/))  strength += 1;

        //if it has numbers and characters, increase strength value
        if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/))  strength += 1;

        //if it has one special character, increase strength value
        if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/))  strength += 1;

        //if it has two special characters, increase strength value
        if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1;
        return strength;
    }

}
function checkPasswordMatch() {
    var password = $("#password").val();
    var confirmPassword = $("#conformPassword").val();
    if (password !== confirmPassword)
        $("#conformPassword").next().css({
            "background": "url(../../commons/images/wrong_state.png)  left center no-repeat",
            "padding-left": "18px"
        }).html(" 密码不一致!");
    else
        $("#conformPassword").next().css("background", "url(../../commons/images/right_state.png)  left center no-repeat").html(" ");
}


function checkEmptyPassword() {
    var password = $("#password").val();
    if (password !== confirmPassword)
        $("#conformPassword").next().html(" 密码不一致!");
    else
        $("#conformPassword").next().html(" match!");
}


//Funtions that that are used across many pages
//loggin captcha function
function makeRandomString(){
    var chars = "ABCDEFGHIJKLMNPQRSTUVWXTZ";
    /* var string_length = Math.floor((Math.random() * 5) + 1);*/
    var randomstring = '';
    /* for (var i = 0; i < string_length; i++)*/
    for (var i = 0; i < 4; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
    }
  return randomstring;
}
function randomString() {
//var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  randomstring = makeRandomString();
    $("#antiBotValue").val(randomstring);
    $('.home_check').html(randomstring);
}
randomString();
window.onload = randomString;
//end of loggin captcha function


/*notes

 do not user document ready on a script that is load after the page has alrady been loaded.
 otherwise the script will keep waiting for the document to load and will never run because the document will not load again.


 */




 