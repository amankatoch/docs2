/**
 * Home client module
 * written by Harm Meijer: harmmeiier@gmail.com
 */
  lbs.routes['/home'] = {mod: 'lbs.home', location: '/main.js'};
  lbs.routes['/home-default'] = {mod: 'lbs.home-default', location: '/main.js'};
  lbs.routes['/home/activities'] = {mod: 'lbs.home.activities', location: '/home/activities/main.js'};
  console.log('home is loaded...');
  lbs.modules['/home'] = {
    container:"body"
    ,rendered:false
    ,basePath:'/'
    ,endPoints:{}
    ,deps : ['/basemodule']
    ,create : function create(){
      this.parent=lbs.basemodule;
      lbs.home = this;
      delete this.deps;
      delete this.create;
    }
    ,render : function render(arg){
      arg = arg || {};
      if(arg.fromChild!==true){
        return lbs.modHelper.getMod('/home-default')
        .then(function(mod){
          return mod.render({container:'#home_main_containter_selector'});
        });
      }
      var d = arg.defer || jQuery.Deferred();
      //load and render the body if not already done so
      var me = this;
      console.log('home render');
      if(!this.rendered){
        console.log('rendering home');
        this.parent.render()
        .then(function(){//get the view
          return lbs.modHelper.getView(lbs.settings.views.masterTemplate);
        }).then(function(view){
          lbs.modHelper.setContainer({mod:me,html:Mustache.render(view,{}),container:me.container});
          lbs.actionHandler({container:me.container,handlers:me.handlers});
          me.rendered=true;
          d.resolve();
        });
      }else{
        d.resolve();
      }
      return d.promise();
    }
    ,handlers:{
      'home:bbqUpdate': lbs.globalHandlers.bbqUpdate
    }
    ,remove : function remove(){
      //@todo, workspace is being removed, call menu remove and clean up
      this.rendered=false;
    }
  };
  
  //this is the home default, not routable but can only be created by / (lbs.home)
  lbs.modules['/home-default'] = {
    parent:null
    ,render : function render(arg){
      console.log('home-default render');
      arg = arg || {};
      var d = arg.defer || jQuery.Deferred();
      var me = this;
      var randomString;
      jQuery.when(
        lbs.modHelper.getView(lbs.settings.views.defaultTemplate)
        ,this.parent.render({fromChild:true})
      )
      .then(function(view){
        randomString=makeRandomString();
        lbs.modHelper.setContainer({
          mod:me
          ,html:Mustache.render(view,{randomString:randomString})
          ,container:arg.container
        });
        lbs.actionHandler({container:arg.container,handlers:me.handlers});
        $("#home_main_containter_selector").removeClass('notHomeMainContainer');//add a new class to the main_contaiter
        $("#home_main_containter_selector").addClass('home_main_containter');
        d.resolve(arg);
      });
      return d.promise();
    }
    ,deps : []
    ,remove : function remove(){
      console.log('removing home');
    }
    ,handlers:{
      'home-default:bbqUpdate': lbs.globalHandlers.bbqUpdate
    }
    ,login : function login(e){
      e.preventDefault();
      var loginFail = function(e){
        alert("Invalid user name or password !!");
      };
      //@todo: could bind in template and bind these values to a login object
      //  maintained by this module
     // $(e.currentTarget).addClass('btnPressed');
      lbs.modHelper.getMessage(lbs.basemodule.endPoints.login,false,false,'POST',{
            "username": $("#username").val(),
            "password": $("#password").val(),
            "user_captcha": $("#user_captcha").val(),
            "antiBotValue": $("#antiBotValue").val()
        })
      .then(function(msg){
        if(msg&&msg.pl&&msg.pl.status===true){
          lbs.user=msg.pl;
         $.bbq.pushState('#/workspace/welcome');
        }
        else{
          loginFail(msg);
        }
      })
      .fail(function(msg){
        loginFail(msg);
      });
      return;
      //check out http://localhost/home/home.js
      //$("#homeLoginSubmit").click(function (e) {
      var d = jQuery.Deferred();
      lbs.modHelper.getMessage(this.endPoints.login)
      .then(function(message){
        if(message.er===null){
          lbs.user=message.pl;
        }
        d.resolve(message);
      })
      .fail(function(e){//@todo: render content with login module
        lbs.user=null;
        lbs.workspacelogin.render(arg)
        .then(function(msg){
          lbs.modHelper.getMessage(lbs.basemodule.endPoints.userInfo)
          .then(function(message){
            if(message.er===null){
              lbs.user=message.pl;
            }
            d.resolve(message);
          });
        });
      });
      return d.promise();
    }
    ,create : function create(){
      lbs['home-default'] = this;
      var me = this;
      this.handlers['home-default:login'] = function(e){
        me.login(e);
      }
      this.parent=lbs.home;
      delete this.deps;
      delete this.create;
    }
  };
