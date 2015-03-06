/**
 * workspace client module
 * All controllers inherit from this one, for example /workspace and /smm inherit
 *   from this and everything under those modules inherit from /workspace or /smm
 * written by Harm Meijer: harmmeiier@gmail.com
 */
  lbs.routes['/workspace'] = {mod: 'lbs.workspace', location: '/workspace/main.js'};
  lbs.routes['/workspace:nomenu'] = {mod: 'lbs.workspace:nomenu', location: '/workspace/main.js'};
  lbs.routes['/workspace/menu'] = {mod: 'lbs.workspacemenu', location: '/workspace/main.js'};
  lbs.routes['/workspace/login'] = {mod: 'lbs.workspacelogin', location: '/workspace/main.js'};
  lbs.routes['/workspace/welcome'] = {mod: 'lbs.workspacewelcome', location: '/workspace/main.js'};
  lbs.routes['/workspace/header'] = {mod: 'lbs.workspaceheader', location: '/workspace/main.js'};
  lbs.routes['/workspace'] = {mod: 'lbs.workspace', location: '/workspace/main.js'};
  console.log('workspace is loaded...');
  lbs.modules['/workspace'] = {//lbs.workspace
    container:"body"
    ,rendered:false
    ,basePath:'/workspace'
    ,menu:null
    ,endPoints:{}
    ,deps : ['/basemodule','/workspace/menu','/workspace/login','/workspace/header']
    ,create : function create(){
      console.log('this is workspace create');
      this.parent=lbs.basemodule;
      this.endPoints.navigation = this.basePath+'/profiles/v1/navigation.json';
      lbs.workspace = this;
      delete this.deps;
      delete this.create;
    }
    ,render : function render(arg){
      $(document).off('ajaxStop');
      //only render if another module replaced the container (and set remove on me)    
      arg = arg || {};
      var d = arg.defer || jQuery.Deferred();
      //load and render the body if not already done so
      var me = this;
      //@todo: when multiple mods and templates are loaded put the return (promise) in an array
      //  jQuery.when.apply(jQuery,promises).then(function(){
      //  this will load them simultaniously instead of stacking them in serie
      console.log('workspace render');
      if(!this.rendered){
        console.log('re rendering');
        this.parent.render()
        .then(function(){//get the view
          return lbs.modHelper.getView("/workspace/master.html");//@todo: modulise the menu based on lbs.user.userType
        }).then(function(view){
          lbs.modHelper.setContainer({mod:me,html:Mustache.render(view,{}),container:me.container});
          me.rendered=true;
        })
        .then(function(){
          return jQuery.when(
            (lbs.user)?{pl:lbs.user}//either return user, get user from session or give user a chance to log in
              :lbs.modHelper.getMessage(lbs.basemodule.endPoints.userInfo,false,{})
            ,lbs.modHelper.getMod('/workspace/menu')//get mod for menu
            ,lbs.modHelper.getMod('/workspace/header')//get mod for header
          );
        }).then(function(msg,menuMod,headerMod){
          if(msg && msg.pl){
            lbs.user = msg.pl;
          }
          me.menu=menuMod;
          return jQuery.when(
            me.menu.render({mobileContainer:".topMobileNavigations",bigContainer:".leftNavigations"})
            ,headerMod.render({container:'#header'})
          );          
        }).then(function(){
          d.resolve();
        });

      }else{
        this.menu.showCurrentMenu();
        d.resolve();
      }
      return d.promise();
    }
    ,remove : function remove(){
      this.rendered=false;
      this.menu.remove();
    }
    ,handleLogin : function handleLogin(arg){
      arg = arg || {};
      var me = this;
      var d = jQuery.Deferred();
      lbs.modHelper.getMessage(lbs.basemodule.endPoints.userInfo)
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
  };
  
  lbs.modules['/workspace/menu'] = {
    userMinified:false
    ,userMaxified:false
    ,delay:false
    ,asBig:true
    ,asMobile:false
    ,currentContainer:''
    ,mobileContainer:'.topMobileNavigations'
    ,bigContainer:'.leftNavigations'
    ,render : function render(arg){
      //only render if another module replaced the container (and set remove on me)
      var menuView = "/workspace/welcome/menu.html";
      var jsonMenu;
      arg = arg || {};
      this.mobileContainer = arg.mobileContainer || this.mobileContainer;
      this.bigContainer = arg.bigContainer || this.bigContainer;
      this.currentContainer = this.bigContainer;
      var d = arg.defer || jQuery.Deferred();
      var split;
      var me = this;
      //@todo: set mobile and big container based on passed args with defaults
      jQuery.when(
        lbs.modHelper.getMessage(lbs.workspace.endPoints.navigation,true,{})
        ,lbs.modHelper.getView(menuView)
      )
      .then(function(msg,view){
        split = Math.ceil(msg.pl.length/2);
        jsonMenu = {menu1:msg.pl.slice(0,split),menu2:msg.pl.slice(split)};
        console.log(jsonMenu);
        jsonMenu.menuNumber=1;
        lbs.modHelper.setContainer({
          mod:me
          ,html:Mustache.render(view,jsonMenu)
          ,container:me.bigContainer
        });
        lbs.actionHandler({container:me.bigContainer,handlers:me.handlers});
        oldWayOfMakingMenu();
        me.showCurrentMenu();
        jQuery(window).on('resize.formenu',function(e){me.windowResizeDelay(e);});
        me.windowResize();
        d.resolve(arg);
      });
      return d.promise();
    }
    ,deps : []
    ,windowResizeDelay : function windowResizeDelay(e){
      //do not do resize on every microsecond, wait 250 miliseconds 
      //  before actual code executes
      var me = this;
      clearTimeout(this.delay);
      this.delay = setTimeout(function(){
        me.windowResize(e);
      },250);
    }
    ,showCurrentMenu : function showCurrentMenu(){
      //@todo: not the best solution, depends too much on DOM
      var url = jQuery.param.fragment();
      var $menuItem = jQuery(this.currentContainer).find('.menu1 [data-linkto=\''+url+'\']');
      var $parentItem = $menuItem.parents('.nav_list_bg').find('.service_name');
      this.slideOpen({currentTarget:$parentItem[0]});
      this.handlers.highLightSelectedSubmunuItem({currentTarget:$menuItem[0],preventDefault:function(){}});
    }
    ,slideOpen:function(e){
      //@todo: only on current container
      jQuery(this.currentContainer).find('.nav-menu .nav_list_bg.open').removeClass('open');
      jQuery(e.currentTarget).parents('.nav_list_bg').addClass('open');
      //pita to slide down, jquery leaves a style=display:block that overrides hiding the menu later
      if(typeof e.preventDefault === 'function'){
        e.preventDefault();
        jQuery(e.currentTarget).siblings('div.detail_frame').hide().slideDown('fast').css('display','');
      }
    }
    ,remove : function remove(){
      console.log('removing menu');
      jQuery(window).off('resize.formenu');
    }
    ,windowResize:function windowResize(e){
      var needMobile = false;
      var width = $(window).width();
      var menuEl;
      if (width < 991) {
        if(!this.userMaxified){
          this.toMini();
        }
        if (width < 421){
          needMobile=true;
          this.toNormal();
        }else if (width < 560) {
          $('#right_container').width($(".wrapper").width() - $(".menu1").width() + 25);
        }else if (width < 760) {
          $('#right_container').width($(".wrapper").width() - $(".menu1").width() + 20);
        }
        else {
          $('#right_container').width($(".wrapper").width() - $(".menu1").width() + 20);
        }
      }
      else {
        if(!this.userMinified){
          this.toNormal();
        }
        $('#right_container').width($(".wrapper").width() - $(".menu1").width() + 25);          
      }
      //move menu from/to mobile big if needed
      if(needMobile && this.asBig){
        console.log('need to move to mobile');
        jQuery(this.mobileContainer)[0]
                .appendChild(jQuery(this.currentContainer + ' > div')[0]);
        this.currentContainer = this.mobileContainer;
        this.asBig=false;
        this.asMobile=true;
      }
      if(!needMobile && this.asMobile){
        console.log('need to move to big');
        jQuery(this.bigContainer)[0]
                .appendChild(jQuery(this.currentContainer + ' > div')[0]);
        this.currentContainer = this.bigContainer;
        this.asBig=true;
        this.asMobile=false;
      }
    }
    ,toMini:function toMini(){
      jQuery(this.currentContainer).find(".menu1").addClass('mini');
      this.setPopovers();      
    }
    ,toNormal:function toNormal(){
      jQuery(this.currentContainer).find(".menu1").removeClass('mini');
      this.removePopovers();
    }
    ,handlers:{
      highLightSelectedSubmunuItem : function (e) {
        e.preventDefault();
        $this=$(e.currentTarget);
        $(".details").removeClass('highlighted');
        $this.addClass('highlighted');
        if(jQuery(".navbar-collapse.collapse.in").length){
          jQuery(".navbar-toggle").trigger('click');
        }
      }
      ,bbqUpdate: lbs.globalHandlers.bbqUpdate
    }
    ,setPopovers : function(){
      //@todo: can only pass string to the popover, all behavior has to be added
      //  after setting the popover
      //http://stackoverflow.com/questions/15989591/how-can-i-keep-bootstrap-popover-alive-while-the-popover-is-being-hovered
      jQuery(this.currentContainer).find('.nav_list_bg').each(function(){
        $(this).popover({
        trigger:'click hover'
        ,html:true
        ,template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content" style="width:150px"></div></div>'
        ,container:'body'
        ,delay: { "show": 500, "hide": 1500 }
        ,content:jQuery(this).find('.detail_frame').html()});
      });
              
              
    }
    ,removePopovers : function(){
      jQuery(this.currentContainer).find('.nav_list_bg').popover('destroy');
    }
    ,miniMaxi:function(e){
      if(jQuery(this.currentContainer).find('.menu1.mini').length===0){
        this.userMinified=true;
        this.userMaxified=false;
        this.toMini();
      }else{
        this.userMinified=false;
        this.userMaxified=true;
        this.toNormal();
      }
      this.windowResize();
    }
    ,create : function create(){
      lbs.workspacemenu = this;
      var me = this;
      this.handlers.miniMaxi=function(e){
        me.miniMaxi(e);
      };
      this.handlers.slideOpen = function(e){
        me.slideOpen(e);
      };
      delete this.deps;
      delete this.create;
    }
  };

  lbs.modules['/workspace/login'] = {
    defer : null
    ,rendered : false
    //parent renders this module, since it can be any parent we don't specify parent here
    //  render won't call parent.render either. At some point the menu can be a general module
    //  not only depending on workspace
    ,render : function render(arg){
      var me = this;
      if(!this.rendered){
        arg = arg || {};
        this.modalToHide = arg.modalToHide || false;
        this.persist=arg.persist || false;
        this.defer = jQuery.Deferred();
        this.container = document.createElement('div');
        document.body.appendChild(this.container);
        jQuery(this.container).addClass('modal');
        lbs.modHelper.getView('/workspace/login.html')
        .then(function(view){
          jQuery(me.container).html(Mustache.render(view,arg));
          if(me.modalToHide){
            jQuery(me.modalToHide).modal('hide');
          }
          jQuery(me.container).modal();
          jQuery(me.container).on('hide.bs.modal',me.handlers.closeDialog);
          lbs.actionHandler({handlers:me.handlers,container:me.container});
          this.rendered = true;
        });
      }
      return this.defer.promise();
    }
    ,deps:[]
    ,handlers : {
    }
    ,login:function login(e){
      var me = this;
      e.preventDefault();
      console.log('loging in');
      jQuery.post(
        lbs.basemodule.endPoints.login
        ,{
            password:document.getElementById('password').value
            ,username:document.getElementById('username').value
            //password:'123456'
            //,username:'leo'
          ,antiBotValue:'MSNP'
          ,user_captcha:'MSNP'
        }
      ).then(function resolve(e){
            console.log('after post',e);
        if(e&&e.pl&&e.pl.status===true){
          me.logedIn();
        }
      },function reject(msg){
        var msg = (msg && msg.status === 0)?'You are disconnected, please connect and try again':'Login failed, please try again.';//@todo: should come from lbs.settings.messages
        $('.login-status').html(msg);//@todo: should
            console.log('reject after post');
      });
    }
    ,closeDialog : function closeDialog(e){
      if(this.persist){
        e.preventDefault();
      }else{
        this.rendered=false;
      }
    }
    ,logedIn : function logedIn(){
      //remove event listeners
      jQuery(this.container).off('hide.bs.modal');
      $(this.container).modal('hide');
      if(this.modalToHide){
        jQuery(this.modalToHide).modal('show');
      }
      jQuery(this.container).remove();
      this.rendered = false;
      this.defer.resolve();
    }
    ,create : function create(){
      var me = this;
      this.handlers.login = function(e){
        me.login(e);
      };
      this.handlers.closeDialog = function(e){
        me.closeDialog(e);
      };
      lbs.workspacelogin = this;
      delete this.create;
      delete this.deps;
      console.log('just deleted the deps',this);
    }
  };

  lbs.modules['/workspace/welcome'] = {
    defer : null
    ,rendered : false
    ,container: '#right_container'
    //parent renders this module, since it can be any parent we don't specify parent here
    //  render won't call parent.render either. At some point the menu can be a general module
    //  not only depending on workspace
    ,render : function render(arg){
      var arg = arg || {};
      var d = arg.defer || jQuery.Deferred();
      var me = this;//resolve handler needs a reference to this
      var view; 
      this.parent.render(arg)
      .then(function(){
        console.log(lbs.user);
        if(lbs.user.userType==='personal'){
          view = "/workspace/welcome/personalHome.html"
        }
        if(lbs.user.userType === 'corporate'){
          view = "/workspace/welcome/corporateHome.html";
        }
        if(lbs.user.userType === 'admin'){
          view = "/workspace/welcome/adminHome.html";
        }
        //load child (list module) and view for this module 
        return lbs.modHelper.getView(view)
      })
      .then(function(view){
        //no data to bind so we can continue
        lbs.modHelper.setContainer({mod:me,html:Mustache.render(view,{}),container:me.container});
            if(lbs.user.loginCount===1&&!me.shownModal) {//rolland jan.9
              me.shownModal = true;
              lbs.modHelper.getView('/workspace/firstTimeWelcomePopUp.html')
                  .then(function (view) {
                    lbs.modHelper.setContainer({
                      container:'#platformAPIsModal'
                      ,html:view
                    });
                    jQuery('#platformAPIsModal').modal();
                    countDown(function(){
                      jQuery('#platformAPIsModal').modal('hide');
//                        .on('hidden.bs.modal',function(e){
//                          lbs.modHelper.setContainer({
//                            container:'#platformAPIsModal'
//                            ,html:''
//                          });
//                        });
                    });
                  });
            }
        d.resolve();
      });
      return d.promise();
    }
    ,deps:['/workspace']
    ,handlers : {
    }
    ,create : function create(){
      lbs.workspacewelcome = this;
      this.parent = lbs.workspace;
      delete this.create;
      delete this.deps;
    }
  };
  
  lbs.modules['/workspace/header'] = {
    deps : []
    ,create : function create(){
      lbs.workspaceheader = this;
      var me = this;
      this.handlers['workspace:header:logout']=function(e){
        me.logout(e);
      };
      delete this.deps;
      delete this.create;
    }
    ,render : function render(arg){
      arg = arg || {};
      var d = arg.defer || jQuery.Deferred();
      var me = this;
      jQuery.when(
        lbs.modHelper.getView('/workspace/header.html')
      ).then(function(view){
        lbs.modHelper.setContainer({mod:me,html:Mustache.render(view,{user:lbs.user}),container:arg.container});
        lbs.actionHandler({container:arg.container,handlers:me.handlers});
        d.resolve();
      });
      return d.promise();
    }
    ,logout:function logout(e){
      e.preventDefault();
      lbs.modHelper.getMessage(lbs.basemodule.endPoints.logout)
      .then(function(msg){
        lbs.user=null;
        lbs.cache[lbs.workspace.endPoints.navigation]=false;
        lbs.globalHandlers.bbqUpdate(false,'/home');
      });
    }
    ,handlers:{
      'workspace:header:bbqUpdate': lbs.globalHandlers.bbqUpdate
      ,'workspace:header:search':function(e){
        //@todo: implement search
        console.log('preventing search to submit the form');
        e.preventDefault();
      }
      ,'workspace:header:openSettings':function(e){
        //@todo: for now it's static content but it should be an own module to 
        //  open and edit user settings
        lbs.modHelper.getMod('/global:modal')
        .then(function(modalMod){
          modalMod.render({view:'/workspace/settingsModal.html',container:'#platformAPIsModal'});
        });
      }
    }
    ,remove : function remove(){
    }
  };

  lbs.modules['/workspace:nomenu'] = {//lbs.workspace
    container:"body"
    ,rendered:false
    ,basePath:'/workspace'
    ,endPoints:{}
    ,deps : ['/basemodule','/workspace/login','/workspace/header']
    ,create : function create(){
      this.parent=lbs.basemodule;
      this.endPoints.navigation = this.basePath+'/profiles/v1/navigation.json';
      lbs['workspace:nomenu'] = this;
      delete this.deps;
      delete this.create;
    }
    ,render : function render(arg){
      $(document).off('ajaxStop');
      //only render if another module replaced the container (and set remove on me)    
      arg = arg || {};
      var d = arg.defer || jQuery.Deferred();
      //load and render the body if not already done so
      var me = this;
      //@todo: when multiple mods and templates are loaded put the return (promise) in an array
      //  jQuery.when.apply(jQuery,promises).then(function(){
      //  this will load them simultaniously instead of stacking them in serie
      if(!this.rendered){
        this.parent.render()
        .then(function(){//get the view
          return lbs.modHelper.getView("/workspace/master_no_menu.html");//@todo: modulise the menu based on lbs.user.userType
        }).then(function(view){
          lbs.modHelper.setContainer({mod:me,html:Mustache.render(view,{}),container:me.container});
          me.rendered=true;
          return jQuery.when(
            (lbs.user)?{pl:lbs.user}//either return user, get user from session or give user a chance to log in
              :lbs.modHelper.getMessage(lbs.basemodule.endPoints.userInfo,false,{})
            ,lbs.modHelper.getMod('/workspace/header')//get mod for header
          );
        }).then(function(msg,headerMod){
          if(msg && msg.pl){
            lbs.user = msg.pl;
          }
          return headerMod.render({container:'#header'});
        }).then(function(){
          d.resolve();
        });

      }
      return d.promise();
    }
    ,remove : function remove(){
      this.rendered=false;
    }
    ,handleLogin : function handleLogin(arg){
      arg = arg || {};
      var me = this;
      var d = jQuery.Deferred();
      lbs.modHelper.getMessage(lbs.basemodule.endPoints.userInfo)
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
  };


  var oldWayOfMakingMenu = function(){
    //@todo: clean this up, remove functions from global scope
    //  either namespace them or make them part of the menu
      //slideEffectsHandler();
      //sidebarSwaper();
      //@todo: this event listener needs to be removed when unloaded
      //sidebar();
  };