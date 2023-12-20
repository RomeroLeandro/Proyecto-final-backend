class usersDto {
  constructor(users) {
    this.users = users.map((user) => ({
      id: user._id ? user._id.toString() : user.id,
      name: `${user.name} ${user.last_name}`,
      email: user.email ? user.email : user.name,
      role: user.role,
    }));
  }
}

module.exports = usersDto;
