export default class {
  constructor(params) {
    ({
      sentences: this.sentences,
      writer: this.writer,
      cursor: this.cursor,
    } = params);

    this.sentenceIndex = 0;
    this.cursorDisplayed = false;
    this.pickSentence();
    this.type();
    setInterval(this.animateCursor.bind(this), 600);
  }

  pickSentence() {
    this.sentence = this.sentences[this.sentenceIndex];
    this.sentenceIndex += 1;
    this.sentenceIndex %= this.sentences.length;
    this.writerIndex = 0;
  }

  type() {
    const caption = this.sentence.substring(0, this.writerIndex);
    this.writerIndex += 1;
    this.writer.innerHTML = caption;

    if(this.writerIndex <= this.sentence.length) {
      setTimeout(this.type.bind(this), 75);
    }
    else {
      setTimeout(this.erase.bind(this), 2000);
    }
  }

  erase() {
    const caption = this.sentence.substring(0, this.writerIndex);
    this.writerIndex -= 1;
    this.writer.innerHTML = caption;
    if(this.writerIndex >= 0) {
      setTimeout(this.erase.bind(this), 75);
    }
    else {
      this.pickSentence();
      setTimeout(this.type.bind(this), 500);
    }
  }

  animateCursor() {
    let innerHTML = '';
    if(this.cursorDisplayed) {
      innerHTML = '|';
    }

    this.cursor.innerHTML = innerHTML;
    this.cursorDisplayed = !this.cursorDisplayed;
  }
}
