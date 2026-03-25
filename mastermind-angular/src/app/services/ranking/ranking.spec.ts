import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RankingService, RankingEntry } from './ranking';

describe('RankingService', () => {
  let service: RankingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(RankingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getRanking should GET /ranking and return list ordered by bestScore', () => {
    const mockRanking: RankingEntry[] = [
      { username: 'felix', bestScore: 1000 },
      { username: 'admin', bestScore: 500 }
    ];

    service.getRanking().subscribe(ranking => {
      expect(ranking.length).toBe(2);
      expect(ranking[0].username).toBe('felix');
      expect(ranking[0].bestScore).toBe(1000);
      expect(ranking[1].username).toBe('admin');
    });

    const req = httpMock.expectOne('http://localhost:8080/ranking');
    expect(req.request.method).toBe('GET');
    req.flush(mockRanking);
  });

  it('getRanking should return empty list when no players', () => {
    service.getRanking().subscribe(ranking => {
      expect(ranking.length).toBe(0);
    });

    const req = httpMock.expectOne('http://localhost:8080/ranking');
    req.flush([]);
  });
});
