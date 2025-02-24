// src/tests/models.test.js
const mongoose = require('mongoose');
const { User, Vote } = require('../models');

// Connect to test database before all tests
beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eurovision_test', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

// Clear database after each test
afterEach(async () => {
    await User.deleteMany();
    await Vote.deleteMany();
});

// Disconnect after all tests
afterAll(async () => {
    await mongoose.connection.close();
});

// User Model Tests
describe('User Model Tests', () => {
    describe('User Creation', () => {
        it('should create & save user successfully', async () => {
            const validUser = new User({
                name: 'Kuba',
                isAdmin: false
            });
            const savedUser = await validUser.save();

            expect(savedUser._id).toBeDefined();
            expect(savedUser.name).toBe('Kuba');
            expect(savedUser.isAdmin).toBe(false);
            expect(savedUser.votes).toEqual([]);
        });

        it('should fail to save user without required name', async () => {
            const userWithoutName = new User({
                isAdmin: false
            });

            let err;
            try {
                await userWithoutName.save();
            } catch (error) {
                err = error;
            }

            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(err.errors.name).toBeDefined();
        });

        it('should set default isAdmin to false', async () => {
            const user = new User({
                name: 'Kuba'
            });
            const savedUser = await user.save();

            expect(savedUser.isAdmin).toBe(false);
        });
    });

    describe('User Methods', () => {
        it('should add vote to user votes array', async () => {
            const user = await User.create({
                name: 'TestUser',
                isAdmin: false
            });

            const vote = await Vote.create({
                stage: 'polfinal1',
                vote: 12,
                userVote: user._id
            });

            await user.addVote(vote._id);
            const updatedUser = await User.findById(user._id).populate('votes');

            expect(updatedUser.votes).toHaveLength(1);
            expect(updatedUser.votes[0]._id).toEqual(vote._id);
        });
    });
});

// Vote Model Tests
describe('Vote Model Tests', () => {
    let testUser;

    beforeEach(async () => {
        testUser = await User.create({
            name: 'TestUser',
            isAdmin: false
        });
    });

    describe('Vote Creation', () => {
        it('should create & save vote successfully', async () => {
            const validVote = new Vote({
                stage: 'polfinal1',
                vote: 12,
                userVote: testUser._id
            });
            const savedVote = await validVote.save();

            expect(savedVote._id).toBeDefined();
            expect(savedVote.stage).toBe('polfinal1');
            expect(savedVote.vote).toBe(12);
            expect(savedVote.userVote).toEqual(testUser._id);
        });

        it('should create vote with minimum points (0)', async () => {
            const vote = new Vote({
                stage: 'polfinal1',
                vote: 0,
                userVote: testUser._id
            });
            const savedVote = await vote.save();

            expect(savedVote.vote).toBe(0);
        });

        it('should create vote with maximum points (12)', async () => {
            const vote = new Vote({
                stage: 'polfinal1',
                vote: 12,
                userVote: testUser._id
            });
            const savedVote = await vote.save();

            expect(savedVote.vote).toBe(12);
        });
    });

    describe('Vote Validation', () => {
        it('should fail to save vote with invalid stage', async () => {
            const invalidVote = new Vote({
                stage: 'invalid_stage',
                vote: 12,
                userVote: testUser._id
            });

            await expect(async () => {
                await invalidVote.save();
            }).rejects.toThrow(mongoose.Error.ValidationError);
        });

        it('should fail to save vote without stage', async () => {
            const invalidVote = new Vote({
                vote: 12,
                userVote: testUser._id
            });

            try {
                await invalidVote.save();
            } catch (error) {
                expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
                expect(error.errors.stage).toBeDefined();
                expect(error.errors.stage.kind).toBe('required');
            }
        });

        it('should fail to save vote without vote value', async () => {
            const invalidVote = new Vote({
                stage: 'polfinal1',
                userVote: testUser._id
            });

            try {
                await invalidVote.save();
            } catch (error) {
                expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
                expect(error.errors.vote).toBeDefined();
                expect(error.errors.vote.kind).toBe('required');
            }
        });

        it('should fail to save vote with negative value', async () => {
            const invalidVote = new Vote({
                stage: 'polfinal1',
                vote: -1,
                userVote: testUser._id
            });

            try {
                await invalidVote.save();
            } catch (error) {
                expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
                expect(error.errors.vote).toBeDefined();
                expect(error.errors.vote.kind).toBe('min');
            }
        });

        it('should fail to save vote with value greater than 12', async () => {
            const invalidVote = new Vote({
                stage: 'polfinal1',
                vote: 13,
                userVote: testUser._id
            });

            try {
                await invalidVote.save();
            } catch (error) {
                expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
                expect(error.errors.vote).toBeDefined();
                expect(error.errors.vote.kind).toBe('max');
            }
        });

        it('should fail to save vote without user reference', async () => {
            const invalidVote = new Vote({
                stage: 'polfinal1',
                vote: 12
            });

            try {
                await invalidVote.save();
            } catch (error) {
                expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
                expect(error.errors.userVote).toBeDefined();
                expect(error.errors.userVote.kind).toBe('required');
            }
        });
    });

    describe('Vote-User Relationship', () => {
        it('should successfully populate user reference', async () => {
            const vote = await Vote.create({
                stage: 'polfinal1',
                vote: 12,
                userVote: testUser._id
            });

            const populatedVote = await Vote.findById(vote._id).populate('userVote');

            expect(populatedVote.userVote).toBeDefined();
            expect(populatedVote.userVote.name).toBe(testUser.name);
        });

        it('should add vote to user votes array and populate correctly', async () => {
            const vote = await Vote.create({
                stage: 'polfinal1',
                vote: 12,
                userVote: testUser._id
            });

            await testUser.addVote(vote._id);
            const updatedUser = await User.findById(testUser._id).populate('votes');

            expect(updatedUser.votes).toHaveLength(1);
            expect(updatedUser.votes[0].stage).toBe('polfinal1');
            expect(updatedUser.votes[0].vote).toBe(12);
        });
    });
});
