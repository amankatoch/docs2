/**
 * standards client module
 * 
 * written by and Harm Meijer: harmmeiier@gmail.com
 */
    console.log('standards is loaded...');
  //register routers/modules of smm if not already registered
  lbs.routes['/workspace'] = lbs.routes['/workspace'] || {mod: 'lbs.workspace', location: '/workspace/main.js'};
  lbs.routes['/workspace/standards'] = 
    lbs.routes['/workspace/standards/idPhotoStandard'] =
    lbs.routes['/workspace/standards/idPhotosUsage'] =
        {mod: 'lbs.workspace.standards', location: '/workspace/standards/main.js'};
  
  lbs.routes['/workspace/standards:list'] = {mod:'lbs.workspace.standards.list',location:'/workspace/standards/main.js'};

  lbs.modules['/workspace/standards'] = 
    lbs.modules['/workspace/standards/idPhotoStandard'] = 
    lbs.modules['/workspace/standards/idPhotosUsage'] =  {
    create:function(){
      this.parent = lbs.workspace;
      this.endPoints={};
      this.endPoints.idPhotoStandard = this.basePath+'/idPhotoStandard.json';
      this.endPoints.idPhotosUsage = this.basePath+'/idPhotosUsage.json';
      this.routeParams={//@todo: in the end there will be one endpoint and we can just pass the filter arguements to it
        '/workspace/standards/idPhotoStandard':{
          listEndPoint:this.endPoints.idPhotoStandard
          ,listView:'/workspace/standards/idPhotoStandardsList.html'
          ,currentPage:'证照标准'
        }
        ,'/workspace/standards/idPhotosUsage':{
          listEndPoint:this.endPoints.idPhotosUsage
          ,listView:'/workspace/standards/idPhotoUsageList.html'
          ,currentPage:'证照用途'
        }
      };
      lbs.workspace.standards = this;
      delete this.deps;
      delete this.create;
    }
    ,basePath:'/workspace/standards'
    ,deps:['/workspace']
    ,container:'#right_container'
    ,routeParams:null
    ,render : function render(arg){
      
      
      var data = {
        container : '.container_bottom'
      };
      return lbs.basemodule['general:list'].parentRender.call(this,{
        listMod:'/workspace/standards:list'
        ,mainView:'/workspace/standards/main.html'
        ,data:data
      });
    }
    ,bunchOfScript : function bunchOfScript(){
      //this stuff was in idPhotosUsage and handles the popup, when implemented this needs to be a module
      // there is probably a lot of behavior associated with the popup
        //select items on click
      $('.idPhotoUsagePopupBox').find('.optionShowTable').find('tr').find('button').click(function (e) {
        if ($(this).hasClass('itemSelected')) {
          alert('此用途已选！');
        }
        else {
          var getId = $(this).parents('tr').find('td:first-child').html();
          var getUsage = $(this).parents('tr').find('td:nth-child(2)').html();
          var getButton = $(this).parents('tr').find('td:nth-child(3)').html();
          $(this).removeClass('lan_white blue_bg ').addClass('itemSelected specialBlue ').text('已选');
          $('.optionSaveTable').find('tbody').append(bluidRow(getId, getUsage, getButton)).find('button')
                  .removeClass('lan_white blue_bg').addClass('itemSelected specialBlue').text('已选');
        }
        e.preventDefault();
      });
      //empty selection table
      $('.idPhotoUsagePopupBox').find('.idPhotoUsagePopupRightBox').find('.clearAllSelections').click(function (e) {
        $('.optionSaveTable').find('tbody').empty();
        $('.optionShowTable').find('button')
                .removeClass('itemSelected specialBlue').addClass('lan_white blue_bg').text('选择');
        // $('.optionSaveTable').find('tbody').html('');
        e.preventDefault();
      });
      var bluidRow = function (cell1, cell2, cell3) {
        var newRow = '<tr><td>' + cell1 + '</td><td>' + cell2 + '</td><td>' + cell3 + '</td></tr>';
        return newRow;

      };
    }
  };


  lbs.modules['/workspace/standards:list'] = {
  view:''
  ,list:[]
  ,viewUrl:null
  ,pageSize:10
  ,index:0
  ,render : function render(arg){
    arg.listView = arg.listView || '/workspace/standards/list.html'
    return lbs.basemodule['general:list'].render.call(this,arg);
  }
  ,create : function(){
    lbs.workspace.standards.list = this;
    delete this.deps;
    delete this.create;
  }
  ,deps:[]
};


