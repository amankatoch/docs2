/**
 * responses client module
 * 
 * written by and Harm Meijer: harmmeiier@gmail.com
 */
    console.log('responses is loaded...');
  //register routers/modules of smm if not already registered
  lbs.routes['/workspace'] = lbs.routes['/workspace'] || {mod: 'lbs.workspace', location: '/workspace/main.js'};
  lbs.routes['/workspace/responses'] = 
    lbs.routes['/workspace/responses/all'] =
    lbs.routes['/workspace/responses/conventional'] =
    lbs.routes['/workspace/responses/favorite'] =
    lbs.routes['/workspace/responses/agent'] =
    lbs.routes['/workspace/responses/delegated'] =
    lbs.routes['/workspace/responses/agentsettings'] =
        {mod: 'lbs.workspace.responses', location: '/workspace/responses/main.js'};
  
  lbs.routes['/workspace/responses:list'] = {mod:'lbs.workspace.responses.list',location:'/workspace/responses/main.js'};

  lbs.modules['/workspace/responses'] = 
    lbs.modules['/workspace/responses/all'] =
    lbs.modules['/workspace/responses/conventional'] =
    lbs.modules['/workspace/responses/favorite'] =
    lbs.modules['/workspace/responses/agent'] =
    lbs.modules['/workspace/responses/delegated'] =
    lbs.modules['/workspace/responses/agentsettings'] = {
    create:function(){
      this.parent = lbs.workspace;
      this.endPoints={};
      this.endPoints.all = this.basePath+'/all.json';
      this.endPoints.conventional = this.basePath+'/conventional.json';
      this.endPoints.favorite = this.basePath+'/favorite.json';
      this.endPoints.agent = this.basePath+'/agent.json';
      this.endPoints.delegated = this.basePath+'/delegated.json';
      this.endPoints.agentsettings = this.basePath+'/agentsettings.json';
      this.routeParams={//@todo: in the end there will be one endpoint and we can just pass the filter arguements to it
        '/workspace/responses/all':{
          listEndPoint:this.endPoints.all
          ,currentPage:'所有事务'
        }
        ,'/workspace/responses/conventional':{
          listEndPoint:this.endPoints.conventional
          ,currentPage:'常规事务'
        }
        ,'/workspace/responses/favorite':{
          listEndPoint:this.endPoints.favorite
          ,currentPage:'收藏事务'
        }
        ,'/workspace/responses/agent':{
          listEndPoint:this.endPoints.agent
          ,currentPage:'代理事务'
        }
        ,'/workspace/responses/delegated':{
          listEndPoint:this.endPoints.delegated
          ,currentPage:'委托事务'
        }
        ,'/workspace/responses/agentsettings':{
          listEndPoint:this.endPoints.agentsettings
          ,listView: '/workspace/responses/agentsettings.html'
          ,currentPage:'代理设置'
        }
      };
      var me = this;
      lbs.workspace.responses = this;
      delete this.deps;
      delete this.create;
    }
    ,basePath:'/workspace/responses'
    ,deps:['/workspace']
    ,container:'#right_container'
    ,routeParams:null
    ,render : function render(arg){
      var data = {
        container : '.container_bottom'
      };
      return lbs.basemodule['general:list'].parentRender.call(this,{
        listMod:'/workspace/responses:list'
        ,mainView:'/workspace/responses/main.html'
        ,data:data
      });
    }
    ,handlers:{}
  };


  lbs.modules['/workspace/responses:list'] = {
  view:''
  ,list:[]
  ,viewUrl:null
  ,pageSize:10
  ,index:0
  ,render : function render(arg){
    arg.listView = arg.listView || '/workspace/responses/list.html'
    return lbs.basemodule['general:list'].render.call(this,arg);
  }
  ,create : function(){
    lbs.workspace.responses.list = this;
    delete this.deps;
    delete this.create;
  }
  ,deps:[]
};