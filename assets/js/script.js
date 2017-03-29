(function(){

  "use strict";

//listen for the dom and when it's loaded excute fun (excuteCode)
  document.addEventListener('DOMContentLoaded', excuteCode);

  function excuteCode(){

    var app = {
      url: 'new',
      template: document.querySelector('.post-template').cloneNode(true),
      posts_container: document.querySelector('.posts').cloneNode(true)
    }



//pull data from the reddit api then loops over
//the returned data (posts) and pass to app.buildPost function.
    app.fetch = function(url){
      reddit('/' + url).get().then(function(data){
        var posts = data.data.children;
        app.posts_container.innerHTML = "";
        for(var i = 0; i < posts.length; i++){
          app.buildPosts(posts[i], i);
        }
      });
    }

    app.fetch(app.url);

    app.buildPosts = function(post, num){
      var order = num + 1;
      var score = post.data.score;
      var thumb = post.data.thumbnail;
      var title = post.data.title;
      var domain = post.data.domain;
      var author = post.data.author;
      var sub = post.data.subreddit_name_prefixed;
      var comments_num = post.data.num_comments;
      var expand = !post.data.media ?
                  (post.data.selftext ?
                   "selftext" : null) : "video";

      var time = (function convertTime(){
        var newDate = new Date().getTime();
        var seconds = Math.floor((newDate / 1000) - post.data.created_utc);
        var formatedTime;

        switch (true){
                case (seconds < 60):
                formatedTime = seconds + " seconds";
                break;

                case (seconds > 60 && seconds < 3600):
                formatedTime = Math.floor(seconds / 60) + " minutes";
                break;

                case (seconds > 3600 && seconds < 86400):
                formatedTime = Math.floor(seconds / 3600) + " hours";
                break;

                case (seconds > 86400):
                formatedTime = Math.floor(seconds / 86400) + " days";
                break;
        }

        return formatedTime;

        })();


        var newPost = app.template.cloneNode(true);

        newPost.classList.remove('post-template');

        newPost.querySelector('.order').textContent = order;
        newPost.querySelector('.score').textContent = score;
        newPost.querySelector('.title').textContent = title;
        newPost.querySelector('.title').href = post.data.url
        newPost.querySelector('.domain').textContent = domain;
        newPost.querySelector('.author').textContent = author;
        newPost.querySelector('.sub').textContent = sub;
        newPost.querySelector('time').textContent = time;
        newPost.querySelector('.comment-num').textContent = comments_num;

        app.posts_container.append(newPost);

    }




    document.querySelector('main').replaceChild(app.posts_container, document.querySelector('.posts'));
    // document.querySelector('main').insertBefore(document.querySelector('aside') , app.posts_container);









  }



















})();
