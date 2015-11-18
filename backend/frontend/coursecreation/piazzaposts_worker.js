import * as http from 'stream-http';

self.addEventListener("message", function(e){
  getPiazzaPosts(e.data);
});

var cached = null;
function getPiazzaPosts(courseId: number){
  let endpoint = mainUrl + `/${courseId}/course/getpiazzaposts/`;
  http.get(endpoint, function(res){
    res.on('data', function(buf){
      let toparse;
      try{
        if(cached){
          toparse = cached + buf.toString();
          cached = null;
        } else {
          toparse = buf.toString();
        }

        let parsed = JSON.parse(buf.toString());
        self.postMessage({
          name: 'piazzaPost',
          post: parsed
        });
      } catch(e) {
        cached = toparse;
      }
    });

    res.on('end', function(){
      self.postMessage('end');
      self.close();
    });
  })
}
