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
        this.exit = this.exit.bind(this)
        this.disconnected = this.disconnected.bind(this);
    }

    connected() {
        log('user connected');
        log(this.public_info());
    }

    join(userType, currentSetting) {
        this.type = userType;
        this.socket.emit('join', { userType: this.type, currentSetting });
        this.socket.broadcast.emit('newUser', this.public_info());
    }

    exit() {
        this.socket.broadcast.emit('user-exit', this.public_info());
        log('user exited', this.public_info());
    }

    disconnected() {
        log('user disconnected', this.public_info());
        this.exit();
    }

    destroy() {
        log('should destroy user');
    }

    public_info() {
        return {
            userType: this.type,
            name: this.name
        };
    }
}
