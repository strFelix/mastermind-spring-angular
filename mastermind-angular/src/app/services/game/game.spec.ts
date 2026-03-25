import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GameService, GameResponse, GuessResponse } from './game';

describe('GameService', () => {
  let service: GameService;
  let httpMock: HttpTestingController;

  const mockGame: GameResponse = {
    id: 1,
    attempts: 0,
    score: 0,
    startTime: '2026-01-01T10:00:00',
    endTime: '',
    finished: false,
    won: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(GameService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('startGame should POST to /game and return GameResponse', () => {
    service.startGame().subscribe(game => {
      expect(game.id).toBe(1);
      expect(game.finished).toBe(false);
    });

    const req = httpMock.expectOne('http://localhost:8080/game');
    expect(req.request.method).toBe('POST');
    req.flush(mockGame);
  });

  it('makeGuess should POST to /game/:id/guess with correct body', () => {
    const mockGuess: GuessResponse = {
      correctPositions: 3,
      finished: false,
      won: false,
      secretCode: null
    };

    service.makeGuess(1, 'ABCC').subscribe(res => {
      expect(res.correctPositions).toBe(3);
      expect(res.won).toBe(false);
    });

    const req = httpMock.expectOne('http://localhost:8080/game/1/guess');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ guess: 'ABCC' });
    req.flush(mockGuess);
  });

  it('makeGuess should return secretCode when game is lost', () => {
    const mockGuess: GuessResponse = {
      correctPositions: 0,
      finished: true,
      won: false,
      secretCode: 'ABCD'
    };

    service.makeGuess(1, 'AAAA').subscribe(res => {
      expect(res.finished).toBe(true);
      expect(res.secretCode).toBe('ABCD');
    });

    const req = httpMock.expectOne('http://localhost:8080/game/1/guess');
    req.flush(mockGuess);
  });

  it('getGame should GET /game/:id', () => {
    service.getGame(1).subscribe(game => {
      expect(game.id).toBe(1);
    });

    const req = httpMock.expectOne('http://localhost:8080/game/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockGame);
  });

  it('getHistory should GET /game/history and return list', () => {
    service.getHistory().subscribe(history => {
      expect(history.length).toBe(1);
      expect(history[0].id).toBe(1);
    });

    const req = httpMock.expectOne('http://localhost:8080/game/history');
    expect(req.request.method).toBe('GET');
    req.flush([mockGame]);
  });
});
