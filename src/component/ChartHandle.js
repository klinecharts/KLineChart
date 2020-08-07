export default class ChartHandle {
    constructor() {
        this.xtimemap = {};
        this.ctxs = {}
    }
    
    static getInstance() {
      if(!this.instance) {
        this.instance = new ChartHandle();
      }
      return this.instance;
    }
  
    add_xts_mapping(x,timestamp){
        this.xtimemap[x] = timestamp
    }
  
    add_tag(tag,ctx){
      this.ctxs[tag,ctx]
    }
  }