const { v4: uuidv4  } = require('uuid');
const log = console.info;

module.exports = class User {
    constructor(socket) {
        this.socket = socket;
        this.type = 'audience';
        this.name = 'anonymous';
        this.currentRoom = 0;
        this.uuid = uuidv4();
        this._bind();
    }

    _bind() {
        this.public_info = this.public_info.bind(this);
        this.join = this.join.bind(this)
        this.disconnected = this.disconnected.bind(this);
    }

    connected() {
        log('user connected');
        log(this.public_info());
    }

    join(userName, userType) {
        this.name = userName;
        this.type = userType;
    }

    disconnected() {
        log('user disconnected', this.public_info());
    }

    destroy() {
        log('should destroy user');
    }

    public_info() {
        return {
            type: this.type,
            name: this.name
        };
    }
}
