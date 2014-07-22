$(function(){
    /*
        自适应高度

     */
    var resizeTimer;
    var resize = function(){
        clearInterval(resizeTimer);
        resizeTimer = null;
        var winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        var headerHeight = $('#header').height();
        var containerHieght = winHeight-headerHeight;

        resizeTimer = setTimeout(function(){

            $('#container').css('height',containerHieght + 'px');
        }, 100);
        
    };
    resize();
    
    $(window).bind('resize',resize);


    /*
        左侧菜单点击

     */
    var sideBarMenuClick = function(e){
        var $target = $(e.currentTarget),$parent = $target.parent();

        $parent.addClass('active').siblings().removeClass('active');



    };
    $('.sidebar').on('click','.sidebar-link',sideBarMenuClick);


    /*
        分页

     */
    
    $('.pagination').pagination(100,{});


    /*
        日历控件


     */
    $.fn.datetimepicker.dates['zh-CN'] = {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        today: "今日",
        suffix: [],
        meridiem: []
    };
    var dateOptions = {
        //initialDate:'2012-12-12',
        language:'zh-CN',
        format:'yyyy-mm-dd',// yyyy-mm-dd hh:ii
        weekStart: 1,// 一周从哪一天开始。0（星期日）到6（星期六）
        todayBtn:  1,
        autoclose: 1,
        startView: 2,//默认值：0 , 'hour' 1 , 'day' 2 , 'month' 3 , 'year' 4 , 'decade'
        minView:2,//默认值：0, 'hour' 2
        pickerPosition:'bottom-left' // bottom-right
    };
    $('.calendar').datetimepicker(dateOptions).on('changeDate', function(e){
        var value = e.currentTarget.value,date = e.date,time = '';
        if(!value){
            value = $(e.currentTarget).find('input[type=text]').val();
        }
        console.log('datetimepicker value',value);
        time =  date && date.getTime();
        $(this).attr('data-time',time);
        
       
    }).on('show',function(){
        $('.datetimepicker .icon-arrow-left').addClass('fa fa-arrow-left');
        $('.datetimepicker .icon-arrow-right').addClass('fa fa-arrow-right');
        //console.log('show')
    });

    /*
        编辑器

     */
    var ue = UE.getEditor('editor');

});