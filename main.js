const dataBlock = [
  {
    "name": "headline",
    "active": false,
    "id": 0,
    "svg": `<use xlink:href="img/sprite.svg#headline"></use>`,
    "title": "Headline",
    "value": ''
  },
  {
    "name": "paragraph",
    "active": false,
    "id": 0,
    "svg": `<use xlink:href="img/sprite.svg#paragraph"></use>`,
    "title": "Paragraph",
    "value": ''
  },
  {
    "name": "button",
    "active": false,
    "id": 0,
    "svg": `<use xlink:href="img/sprite.svg#image"></use>`,
    "title": "Button",
    "value": ''
  },
  {
    "name": "image",
    "active": false,
    "id": 0,
    "svg": `<use xlink:href="img/sprite.svg#image"></use>`,
    "title": "Image",
    "value": ''
  }
];

const prev = Vue.component('prev', {
  template: '#prev',
  props: ['tags', 'tagid', 'tagval'],
  // components: {
  //   imag,
  //   paragraph,
  //   but,
  //   headline
  // },
  data() {
    return {
      createdtags: [],
      string: '',
      show: false
    }
  },
  watch: {
    tags(newtags) {
      this.createpage(newtags);
    },
    tagval() {
      this.createdtags[this.tagid].value = this.tags[this.tagid].value;
      this.createpage(this.tags);
    }
  },
  methods: {
    createcode() {
      let string = '';
      this.createdtags.forEach(tag => {
        switch(tag.name) {
          case "headline":
            string += `<h2>${tag.value}</h2> \n`;
            break;
          case "paragraph":
            string += `<p>\n${tag.value}\n</p> \n`;
            break;
          case "button":
            string += `<button>${tag.value}</button> \n`;
            break;
          case "image":
            if (tag.value === '') {
              string += `<img src="./img/img.png"></img> \n`;
            } else {
              string += `<img src="${tag.value}"></img> \n`;
            }
            break;
        }
      });
      this.string = string;
      this.show = !this.show;
    },
    tagsin() {
      this.createdtags[this.tagid].value = this.tags[this.tagid].value;
    },
    createpage(newtags) {
      this.createdtags = JSON.parse(JSON.stringify(newtags));
      this.createdtags.forEach(tag => {
        switch(tag.name) {
          case "headline":
            tag.html = `<h2 :v-text="tag.value">${tag.value}</h2>`;
            break;
          case "paragraph":
            tag.html = `<p>${tag.value}</p>`;
            break;
          case "button":
            tag.html = `<button>${tag.value}</button>`;
            break;
          case "image":
            if (tag.value === '') {
              tag.html = `<img src="./img/img.png"></img>`;
            } else {
              tag.html = `<img src="${tag.value}"></img>`;
            }
            break;
        }
      });
    }
  }
});
const tag = Vue.component('tag', {
  template: '#tag',
  props: ['tag'],
  data() {
    return {
      active: this.tag.active
    }
  },
  methods: {
    tagclick(id) {
      this.$emit('tagclick', id);
    },
    setvalue(e, id) {
      this.$emit('setvalue', id, e.target.value)
    },
    clickdelete(id) {
      this.$emit('clickdelete', id);
    },
    clickupdown(id, direction) {
      this.$emit('clickupdown', id, direction);
    },
    clickpaste(id) {
      this.$emit('clickpaste', id);
    },
    clickcopy(id) {
      this.$emit('clickcopy', id);
    }
  }
});
const model = Vue.component('model', {
  template: '#model',
  data() {
    return {
      // active: false
    };
  },
  props: ['tags'],
  components: {
    tag
  },
  methods: {
    droppedli(e, ind) {
      this.$emit('droppedli', e, ind);
    },
    dropped(e) {
      console.log(1);
      this.$emit('dropped', e);
    },
    tagclick(id) {
      this.$emit('tagclick', id);
    },
    setvalue(id, symbol) {
      this.$emit('setvalue', id, symbol);
    },
    clickdelete(id) {
      this.$emit('clickdelete', id);
    },
    clickupdown(id, direction) {
      this.$emit('clickupdown', id, direction);
    },
    clickpaste(id) {
      this.$emit('clickpaste', id);
    },
    clickcopy(id) {
      this.$emit('clickcopy', id);
    }
  }
});
const block = Vue.component('block', {
  template: '#block',
  props: ["block", "ind"],
  methods: {
    dragstartblock(e, blockid) {
      this.$emit('dragstartblock', e, blockid);
    }
  }
});
// block.use(DraggablePlugin);
const vuemodule = new Vue({
  el: '#editor',
  data() {
    return {
      blockData: dataBlock,
      tags: [],
      tagval: '',
      tagid: 0
    };
  },
  components: {
    block,
    model,
    prev
  },
  methods: {
    dragstartblock(e, dragId) {
      e.dataTransfer.dropEffect = 'move';
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('dragId', dragId);
    },
    droppedli(e, ind) {
      const tagid = e.dataTransfer.getData('dragId');
      this.tags.splice(ind, 0, JSON.parse(JSON.stringify(this.blockData[tagid])));
      this.tags.map((tag, i) => tag.id = i);
    },
    dropped(e) {
      const tagid = e.dataTransfer.getData('dragId');
      this.handleClick(this.blockData[tagid]);
    },
    tagclick(id) {
      this.tags[id].active = !this.tags[id].active;
    },
    handleClick(tag) {
      const length = this.tags.length;
      this.tags.push(JSON.parse(JSON.stringify(tag)));
      this.tags[length].id = length;
      this.tags[length].active = false;
    },
    setvalue(id, symbols) {
      this.tags[id].value = symbols;
      this.tagid = id;
      this.tagval = symbols;
    },
    clickdelete(id) {
      this.tags.splice(id, 1);
      this.tags.map((tag, i) => tag.id = i);
    },
    clickupdown(id, direction) {
      switch(direction) {
        case "up":
          if (id != 0) {
            this.tags.splice(id-1, 0, this.tags[id]);
            this.tags.splice(id+1, 1);
          }
          break;
        case "down":
          if (id !== this.tags.length - 1) {
            this.tags.splice(id+2, 0, this.tags[id]);
            this.tags.splice(id, 1);
            // this.tags.map((tag, i) => tag.id = i);
          }
          break;
      }
      this.tags.map((tag, i) => tag.id = i);
    },
    clickpaste(id) {
      if (navigator.clipboard) {
        navigator.clipboard.readText()
        .then(text => {
          this.tags[id].value += text;
          // `text` содержит текст, прочитанный из буфера обмена
          this.tagid = id;
          this.tagval = this.tags[id].value;
        })
        .catch(err => {
          // возможно, пользователь не дал разрешение на чтение данных из буфера обмена
          console.log('Something went wrong', err);
        });
      }
    },
    clickcopy(id) {
      this.tags.splice(id, 0, JSON.parse(JSON.stringify(this.tags[id])));
      this.tags.map((tag, i) => tag.id = i);
    }
  }
});
// console.log(vuemodule);
// vuemodule.$mount('#editor');

// document.querySelectorAll('textarea').forEach(el => {
//   el.style.height = el.setAttribute('style', 'height: ' + 'auto');
//   // el.classList.add('auto');
//   el.addEventListener('input', e => {
  
//     // el.style.height = 'auto';
//     el.style.height = (el.scrollHeight) + 'px';
//   });
// });