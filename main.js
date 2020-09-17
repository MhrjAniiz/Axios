document.getElementById("get").addEventListener('click',getInfo);
document.getElementById("post").addEventListener('click',postInfo);
document.getElementById("put_patch").addEventListener('click',putInfo);
document.getElementById("delete").addEventListener('click',deleteInfo);
document.getElementById("simreq").addEventListener('click',reqInfo);
document.getElementById("custom header").addEventListener('click',customInfo);
document.getElementById("transform").addEventListener('click',transformResponse);
document.getElementById("error").addEventListener('click',error);
document.getElementById("cancel").addEventListener('click',cancelInfo);


//axios globals
axios.defaults.headers.common['x-Auth-Token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

function getInfo(){
    // axios({
    //     method: 'get',
    //     url:'https://jsonplaceholder.typicode.com/todos',
    //     params : {
    //         _limit:5
    //     }
    // })
    axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5').then(res=>showData(res))
    .catch(err=> console.log(err));
}

function postInfo(){
    axios({
        method: 'post',
        url:'https://jsonplaceholder.typicode.com/todos',
        data : {
            title: "anish is hero",
            completed:true
        }
    }).then(res=> showData(res)).catch(err=>console.log(err))
}

function putInfo(){
    axios({
        method: 'patch',
        url:"https://jsonplaceholder.typicode.com/todos/1",
        data:{
            title: "updated anish is hero",
            completed:true
        }
    }).then(res=>showData(res))
    .catch(err=>console.log(err))
}

function deleteInfo(){
    axios.delete('https://jsonplaceholder.typicode.com/todos/1').then(res=>showData(res))
}

function reqInfo(){
    axios.all([
        axios.get('https://jsonplaceholder.typicode.com/todos'),
        axios.get('https://jsonplaceholder.typicode.com/posts')
    
    ]).then(
        // res=>{
        // console.log(res[0]);
        // console.log(res[1]);
        // showData(res[0]);
    // }
    //another cleaner way
    axios.spread((todos,posts)=>showData(posts))
    )
    .catch(err=>console.log(err))
}

function customInfo(){
    const config = {
        header:{
            'Content-Type': 'application/json',
            Authorization: 'sometoken'
        }
    }

    axios.post('https://jsonplaceholder.typicode.com/todos?_limit=5',{
        title:'newtodo',
        completed:false
    },config).then(res=>showData(res))
    .catch(err=> console.log(err));
}

function transformResponse(){
   const options ={
       method: 'post',
       url: 'https://jsonplaceholder.typicode.com/todos?_limit=5',
       data: {
           title:'hello world'
       },
       transformResponse: axios.defaults.transformResponse.concat(data=>{
           data.title = data.title.toUpperCase();
           return data;
       })
   }
   axios(options).then(res=>showData(res))
}

function error(){
    axios.get('https://jsonplaceholder.typicode.com/todoss').then(res=>showData(res))
    .catch(err=> {
        if(err.response){
            //server responded with a status other than 200 range
            console.log(err.response.data);
            console.log(err.response.status);

           if(err.response.status === 404){
               alert("Error :page not found");
           }
        }else if(err.request){
                //request was made but no response
                console.error(err.request);
        }else{
                console.error(err.message)
        }
        
        
    });
    
}

function cancelInfo(){
    const source = axios.CancelToken.source();
    axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5',{
        cancelToken:source.token
    }).then(res=>showData(res))
    .catch(thrown => {
        if(axios.isCancel(thrown)){
            console.log('request cancelled',thrown.message)

        }
    });
    if(true){
        source.cancel('request canceled!');
    }
}
//log
axios.interceptors.request.use(config=>{
    const date  = new Date()
    console.log(`${config.method.toUpperCase() } request sent to ${config.url} in ${date.getFullYear()}|${date.getMonth()}|${date.getDate()} at ${date.getTime()}`);

    return config;
},error=>{
    return Promise.reject(err);
});

function showData(res){
    document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}