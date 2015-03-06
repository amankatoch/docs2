/**
 * requests client module
 * 
 * written by and Harm Meijer: harmmeiier@gmail.com
 */
    console.log('requests is loaded...');
  //register routers/modules of smm if not already registered
  lbs.routes['/workspace'] = lbs.routes['/workspace'] || {mod: 'lbs.workspace', location: '/workspace/main.js'};
  lbs.routes['/workspace/requests'] = 
    lbs.routes['/workspace/requests/all'] =
    lbs.routes['/workspace/requests/unprocess'] =
    lbs.routes['/workspace/requests/approved'] =
    lbs.routes['/workspace/requests/rejected'] =
        {mod: 'lbs.workspace.requests', location: '/workspace/requests/main.js'};
  
  lbs.routes['/workspace/requests:list'] = {mod:'lbs.workspace.requests.list',location:'/workspace/requests/main.js'};

  lbs.modules['/workspace/requests'] = 
    lbs.modules['/workspace/requests/all'] = 
    lbs.modules['/workspace/requests/unprocess'] = 
    lbs.modules['/workspace/requests/approved'] = 
    lbs.modules['/workspace/requests/rejected'] = {
    create:function(){
      this.parent = lbs.workspace;
      this.endPoints={};
      this.endPoints.all = this.basePath+'/all.json';
      this.endPoints.unprocess = this.basePath+'/unprocess.json';
      this.endPoints.approved = this.basePath+'/approved.json';
      this.endPoints.rejected = this.basePath+'/rejected.json';
      this.routeParams={//@todo: in the end there will be one endpoint and we can just pass the filter arguements to it
        '/workspace/requests/all':{
          listEndPoint:this.endPoints.all
          ,currentPage:'所有申请'
        }
        ,'/workspace/requests/unprocess':{
          listEndPoint:this.endPoints.unprocess
          ,currentPage:'未申请'
        }
        ,'/workspace/requests/approved':{
          listEndPoint:this.endPoints.approved
          ,currentPage:'已通过'
        }
        ,'/workspace/requests/rejected':{
          listEndPoint:this.endPoints.rejected
          ,currentPage:'已拒绝'
        }
      };
      lbs.workspace.requests = this;
      delete this.deps;
      delete this.create;
    }
    ,basePath:'/workspace/requests'
    ,deps:['/workspace']
    ,container:'#right_container'
    ,routeParams:null
    ,render : function render(arg){
      var data = {
        container : '.container_bottom'
      };
      return lbs.basemodule['general:list'].parentRender.call(this,{
        listMod:'/workspace/requests:list'
        ,mainView:'/workspace/requests/main.html'
        ,data:data
      });
    }
  };


  lbs.modules['/workspace/requests:list'] = {
  view:''
  ,list:[]
  ,pageSize:10
  ,index:0
  ,render : function render(arg){
    arg.listView = arg.listView || '/workspace/requests/list.html'
    return lbs.basemodule['general:list'].render.call(this,arg);
  }
  ,create : function(){
    lbs.workspace.requests.list = this;
    delete this.deps;
    delete this.create;
  }
  ,deps:[]
};
