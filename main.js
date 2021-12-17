/**
* 尊敬的用户，你好：页面 JS 面板是高阶用法，一般不建议普通用户使用，如需使用，请确定你具备研发背景，能够自我排查问题。当然，你也可以咨询身边的技术顾问或者联系宜搭平台的技术支持获得服务（可能收费）。
* 我们可以用 JS 面板来开发一些定制度高功能，比如：调用阿里云接口用来做图像识别、上报用户使用数据（如加载完成打点）等等。
* 你可以点击面板上方的 「使用帮助」了解。
*/

// 当页面渲染完毕后马上调用下面的函数，这个函数是在当前页面 - 设置 - 生命周期 - 页面加载完成时中被关联的。
export function didMount() {
  console.log(`「页面 JS」：当前页面地址 ${location.href}`);
  loadScript();
}


//loadScript方法，创建一个script标签并引入外部JS，执行成功后配合代码快速开发
export function loadScript() {
  new Promise((resolve, reject) => {
    const src = "https://cdnjs.cloudflare.com/ajax/libs/antd/4.17.1/antd.min.js";
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.src = src;
    document.body.appendChild(script);

    const src1 = "https://unpkg.com/react@17/umd/react.development.js";
    const script1 = document.createElement('script');
    script1.setAttribute('type', 'text/javascript');
    script1.src = src1;
    document.body.appendChild(script1);

    const src2 = "https://unpkg.com/react-dom@17/umd/react-dom.development.js";
    const script2 = document.createElement('script');
    script2.setAttribute('type', 'text/javascript');
    script2.src = src2;
    document.body.appendChild(script2);

    const src3 = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/moment.min.js";
    const script3 = document.createElement('script');
    script3.setAttribute('type', 'text/javascript');
    script3.src = src3;
    document.body.appendChild(script3);

    const src4 = "https://cdnjs.cloudflare.com/ajax/libs/antd/4.17.1/antd.min.css";
    const script4 = document.createElement('link');
    script4.href = src4;
    script4.rel = 'stylesheet'
    script4.type = 'text/css'
    document.head.appendChild(script4);

    //script标签的onload事件都是在外部js文件被加载完成并执行完成后才被触发的。
    script.onload = () => {
      resolve("成功");
    };
    script.onerror = reject;
  }).then(() => {
    const _this = ReactDOM
    var now = new Date();
    var value = now.getTime();
    getFromForm(value).then(() => {
      calendar(_this);
    });
  })

}

/**
* 日历组件渲染
*/
function calendar(_this) {
  return _this.render(
    <div>
      <antd.Calendar dateCellRender={dateCellRender} onPanelChange={onPanelChange}/>
    </div>,
    document.getElementById("app")
  )
}

/**
* 日历组件内单元格数据的渲染
*/
function dateCellRender(value) {
  var listData = window.globalData;
  return (
    <ul>
      {listData.map(item => (
        (item.time.getDate() == value.date() && item.time.getMonth() == value.month()
          && item.time.getFullYear() == value.year()) ?
          <li key={item.name}>
            <antd.Badge status='warning' text={item.name} />
          </li> : ''

      ))}
    </ul>
  );
}

/**
* 日历组件面板变化时重新渲染
* todo 实现按月进行渲染数据
*/
function onPanelChange(date, mode) {
  // getFromForm(date._d.getTime()).then(() => {
  //   dateCellRender()
  // })
}

/**
* 获取表单数据
* todo 实现按月获取数据进行渲染
*/
window.globalData = []
function getFromForm(value) {
  return Promise.resolve(new Promise((resolve) => {
    var ajax = new XMLHttpRequest();
    // 根据时间进行获取
    // var start = getStartOfMonth(value);
    // var end = getStartOfNextMonth(value);
    // var json = { dateField_kwg01okk: [start, end] }
    // var jsonStr = JSON.stringify(json)
    var formId = "FORM-ID";
    var pageSize = 100;
    var page = 1;
    for (var i = 1; i < 5;i++) {
      //步骤二:设置请求的url参数,参数一是请求的类型,参数二是请求的url,可以带参数,动态的传递参数starName到服务端
      ajax.open('get', 'https://www.aliwork.com/alibaba/web/APP_ID/v1/form/searchFormDatas.json?formUuid=' + formId
        + '&currentPage=' + i + '&pageSize=' + pageSize
        // + '&searchFieldJson=' + encodeURI(jsonStr)
      , false);
      //步骤三:发送请求
      ajax.send();
      //步骤四:注册事件 onreadystatechange 状态改变就会调用
      if (ajax.readyState == 4 && ajax.status == 200) {
        //步骤五 如果能够进到这个判断 说明 数据 完美的回来了,并且请求的页面是存在的
        var resData = getData(ajax.response)
        window.globalData = resData.concat(window.globalData)
        // console.log(window.globalData);
      }
    }
    resolve(window.globalData)

  }))
}

/**
* 解析数据
*/
function getData(response) {
  var json = JSON.parse(response)
  var dataList = json.content.data
  var totalCount = json.content.totalCount
  console.log(totalCount)
  var resData = []
  for (var i = 0; i < dataList.length; i++) {
    var formData = dataList[i].formData;
    var data = { name: formData.textField_kwhxhr61, time: new Date(formData.dateField_kwg01okk) };
    resData[i] = data
  }
  return resData
}

/**
* 获取当月第1天的时间戳，用于按月获取数据时获取参数
*/
function getStartOfMonth(value) {
  var now = new Date(value);
  now.setDate(1);
  now.setHours(0);
  now.setMinutes(0);
  now.setSeconds(0);
  return now.getTime();
}

/**
* 获取下月第1天的时间戳，用于按月获取数据时获取参数
*/
function getStartOfNextMonth(value) {
  var now = new Date(value);
  var year = now.getFullYear();
  var nextMonth = now.getMonth() + 1;
  var next = new Date(year, nextMonth, 1);
  return next.getTime();
}
