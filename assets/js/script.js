(function(){

//listen for the dom and when it's loaded excute fun (excuteCode)
  if(document.addEventListener){
    document.addEventListener('DOMContentLoaded', excuteCode);
  }else{
//workaround for older browsers that don't support 'DOMContentLoaded' event
    document.onreadystatechange = function(){
      if(document.readyState === 'interactive'){
        excuteCode();
      }
    }
  }


//contains all the functions, idon't know what to call this!
  function excuteCode(){
    console.log('it\'s working');
  }

})();
