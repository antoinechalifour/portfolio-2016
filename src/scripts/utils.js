export function nearestPow2(value){
  var next = value;
  next--;
  next |= next >> 1;  
  next |= next >> 2;  
  next |= next >> 4;  
  next |= next >> 8;  
  next |= next >> 16;
  next++;

  return next;  
};

export function ajax({
  method = 'GET',
  url = '/',
  contentType = 'application/json',
  data = {}
} = {}, cb){
  method = method.toUpperCase();

  return new Promise((resolve, reject) => {
    var req = new XMLHttpRequest();
    req.open(method, url, true);
    req.onload = () => {
      if(req.status >= 200 && req.status < 400) {
        resolve(req);
      } else {
        reject(req);
      }
    };

    req.onerror = () => {
      reject(new Error('Networking error'));
    };

    req.setRequestHeader('Content-Type', contentType);
    req.send(JSON.stringify(data));
  });
};