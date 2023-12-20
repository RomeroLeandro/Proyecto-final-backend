const { transportMail } = require("../config/node.mailer");
const UserRepository = require("../repositories/user.repository");
const { createHash, isValidPassword } = require("../utils/password.hash");

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUsers(params) {
    return this.userRepository.getUsers(params);
  }

  async getUserById(id) {
    return this.userRepository.getUserById(id);
  }

  async getUserByFilter(filter) {
    return this.userRepository.getUserByFilter(filter);
  }

  async addToMyCart(userId, productId) {
    return this.userRepository.addToMyCart(userId, productId);
  }

  async createUser(data) {
    return this.userRepository.createUser(data);
  }

  async resetPassword(userId, password) {
    const user = await this.userRepository.getUserById(userId);

    if (isValidPassword(password, user.password)) {
      throw new Error("New password must be different from the old one");
    }

    const newPassword = createHash(password);
    return this.userRepository.resetPassword(userId, newPassword);
  }

  async updateUserRole(userId, newRole) {
    const ROLE_PREMIUM = "PREMIUM";
    try {
      const user = await this.userRepository.getUserById(userId);
      if (user.role === newRole) {
        throw new Error("User already has this role");
      }
      if (user.role === ROLE_PREMIUM) {
        const requiredDocuments = [
          `${uid}_Identificacion`,
          `${uid}_Comprobante de domicilio`,
          `${uid}_Comprobante de estado de cuenta`,
        ];

        const missingDocuments = requiredDocuments.filter(
          (document) =>
            !user.documents.some((userDoc) => userDoc.name === document)
        );

        if (missingDocuments.length > 0) {
          const splitDocument = requiredDocuments.map((document) => {
            const [uid, name] = document.split("_");
            return { uid, name };
          });

          const missingTypes = splitDocument
            .filter((document) =>
              missingDocuments.includes(`${doc.id}_${doc.type}`)
            )
            .map((doc) => doc.type);

          const missingDocumentsMessage = `You are missing the following documents: ${missingTypes.join(
            ", "
          )}`;
          throw new Error(missingDocumentsMessage);
        }
      }
      return this.userRepository.updateUserRole(userId, newRole);
    } catch (error) {
      throw error;
    }
  }

  async updateUserLastConnection(user) {
    return this.userRepository.updateUserLastConnection(user);
  }

  async updateUserDocuments(userId, documents) {
    const user = await this.userRepository.getUserById(userId);
    const userDocuments = user.documents || [];

    documents.forEach((document) => {
      const documentName = document.documentName.split("_");
      userDocuments.push({
        name: documentName[0],
        reference: `${process.env.BASE_URL}:${process.env.PORT}/img/documents/${file.filename}`,
      });
    });
    return this.userRepository.updateUserDocuments(userId, userDocuments);
  }

  async deleteUser(userId) {
    return this.userRepository.deleteUser(userId);
  }

  async deleteInactiveUsers() {
    try {
      const inactiveTime = Date.now();

      inactiveTime.setMinutes(inactiveTime.getDay() - 2);
      const usersToDeleted = await this.userRepository.getUsers({
        lastConnection: { $lt: inactiveTime },
      });

      if (usersToDeleted.length === 0) throw new Error("No users to delete");

      for (const user of usersToDeleted) {
        if (user.email) {
          await transportMail.sendMail({
            from: `Ecormmerce <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Account deleted",
            html: `<p>Hi ${user.name} ${user.lastName}, your account has been deleted due to inactivity</p>`,
            attachments: [],
          });
        }
      }
      return this.userRepository.deleteInactiveUsers(usersToDeleted);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
