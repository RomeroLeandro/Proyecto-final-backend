class userDto {
  constructor(name, last_name, age) {
    this.full_name = `${name} ${last_name}`;
    this.age = age;
  }
}

module.exports = userDto;
