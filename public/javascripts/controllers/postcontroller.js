app.controller('PostsCtrl', [
  '$scope',
  'posts',
  'post',
  function($scope,posts,post){
    $scope.post = post;
    console.log(post);

    $scope.addComment = function() {
      if($scope.body === '') {return;}
      posts.addComment(post._id, {
        body: $scope.body,
        author: 'user',
      }).success(function(comment){
        $scope.post.comments.push(comment);
      });
      $scope.body = '';
    };

    $scope.upvote = function(comment) {
      console.log(post);
      console.log(comment);
      posts.upvoteComment(post,comment);
    };

    $scope.downvote = function(comment){
      console.log(post);
      console.log(comment);
      posts.downvoteComment(post,comment);

    }

}]);
