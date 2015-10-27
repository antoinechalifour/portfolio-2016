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
}