class userModel {
    constructor(db) {
        this.db = db;
    }

    async getUsers(){
        const query = 'SELECT * FROM User';
        try{
            const [result] = await this.db.execute(query);
            return result;
        } catch (error){
            console.error('Error userModel.getUsers: ', error);
            throw new Error('Error userModel.getUsers');
        }
    }

    async getUserById(id){
        const query = 'SELECT * FROM User WHERE id = ?';
        try{
            const [result] = await this.db.execute(query, [id]);
            return result;
        } catch (error){
            console.error('Error userModel.getUserById: ', error);
            throw new Error('Error userModel.getUserById');
        }
    }

    async getUserByEmail(email){
        const query = 'SELECT * FROM User WHERE email = ?';
        try{
            const [result] = await this.db.execute(query, [email]);
            return result;
        } catch (error){
            console.error('Error userModel.getUserByEmail: ', error);
            throw new Error('Error userModel.getUserByEmail');
        }
    }

    async createUser(user){
        const query = 'INSERT INTO User (email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, "customer")';
        try{
            await this.db.execute(query, [user.email, user.password, user.firstName, user.lastName]);
        } catch (error){
            console.error('Error userModel.createUser: ', error);
            throw new Error('Error userModel.createUser');
        }
    }
}

module.exports = userModel;