/**
 * finance client module
 * 
 * written by and Harm Meijer: harmmeiier@gmail.com
 */
    console.log('finance is loaded...');
  //register routers/modules of smm if not already registered
  lbs.routes['/workspace'] = lbs.routes['/workspace'] || {mod: 'lbs.workspace', location: '/workspace/main.js'};
  lbs.routes['/workspace/finance'] = 
    lbs.routes['/workspace/finance/status'] =
    lbs.routes['/workspace/finance/history'] =
        {mod: 'lbs.workspace.finance', location: '/workspace/finance/main.js'};
  lbs.routes['/workspace/finance/historyorg'] = lbs.routes['/workspace/finance/historyorg'] || {mod: 'lbs.workspace.financehistoryorg', location: '/workspace/main.js'};
  
  lbs.routes['/workspace/finance:list'] = {mod:'lbs.workspace.finance.list',location:'/workspace/finance/main.js'};

  lbs.modules['/workspace/finance'] = 
    lbs.modules['/workspace/finance/status'] = 
    lbs.modules['/workspace/finance/history'] = {
    create:function(){
      this.parent = lbs.workspace;
      this.endPoints={};
      this.endPoints.status = this.basePath+'/status.json';
      this.endPoints.history = this.basePath+'/history.json';
      this.routeParams={//@todo: in the end there will be one endpoint and we can just pass the filter arguements to it
        '/workspace/finance/status':{
          listEndPoint:this.endPoints.status
          ,listView:'/workspace/finance/status.html'
          ,currentPage:'账户状态'
          ,balance : ['账户金额：1000.00 元']
          ,expences: ['累计消费：1400元']
          ,showChargeButton:true
        }
        ,'/workspace/finance/history':{
          listEndPoint:this.endPoints.history
          ,listView:'/workspace/finance/history.html'
          ,currentPage:'交易统计'
          ,balance : ['收入2笔，共1000.00元', '支出4笔，共1000.00元', '账户金额：1000.00 元']
        }
      };
      var me = this;
      lbs.workspace.finance = this;
      delete this.deps;
      delete this.create;
    }
    ,basePath:'/workspace/finance'
    ,deps:['/workspace']
    ,container:'#right_container'
    ,routeParams:null
    ,render : function render(arg){
      var route = jQuery.param.fragment();    
      var data = {
        container : '.container_bottom'
        ,showChargeButton:this.routeParams[route].showChargeButton
        ,balance:this.routeParams[route].balance
        ,expences:this.routeParams[route].expences
      };
      return lbs.basemodule['general:list'].parentRender.call(this,{
        listMod:'/workspace/finance:list'
        ,mainView:'/workspace/finance/main.html'
        ,data:data
      });
    }
    ,handlers:{}
  };


  lbs.modules['/workspace/finance:list'] = {
  view:''
  ,list:[]
  ,viewUrl:null
  ,pageSize:10
  ,index:0
  ,render : function render(arg){
    arg.color = lbs.modHelper.isVal({
      key : function(){
        var num = parseFloat(this.obj.field2,10);
        this.no = (num>=0)?'green':'red';
        if(isNaN(num)){this.no='';}
        this.obj=false;
        return 'colorkey';
      }
      ,val : 2,yes:'yes'
    });
    return lbs.basemodule['general:list'].render.call(this,arg);
  }
  ,create : function(){
    lbs.workspace.finance.list = this;
    delete this.deps;
    delete this.create;
  }
  ,deps:[]
};

    lbs.modules['/workspace/finance/historyorg'] = {
    create:function(){
      this.parent = lbs.workspace;
      var me = this;
      lbs.workspace.financehistoryorg = this;
      delete this.deps;
      delete this.create;
    }
    ,basePath:'/workspace/finance'
    ,deps:['/workspace']
    ,container:'#right_container'
    ,routeParams:null
    ,render : function render(arg){
      var arg = arg || {};
      var d = arg.defer || jQuery.Deferred();
      var me = this;
      var route = jQuery.param.fragment();
      this.parent.render(arg)
      .then(function(){
        return lbs.modHelper.getView('/workspace/finance/historyorg.html')
      })
      .then(function(view){
        //no data to bind so we can continue
        lbs.modHelper.setContainer({mod:me,html:Mustache.render(
            view,{}),container:me.container});
        //register handlers now, we rendered template and set innerhtml
        d.resolve();
      });
      return d.promise();
    }
    ,handlers:{}
  };
