import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IIncident } from '../incident.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../incident.test-samples';

import { IncidentService, RestIncident } from './incident.service';

const requireRestSample: RestIncident = {
  ...sampleWithRequiredData,
  creationDate: sampleWithRequiredData.creationDate?.toJSON(),
  updateDate: sampleWithRequiredData.updateDate?.toJSON(),
  resolutionDate: sampleWithRequiredData.resolutionDate?.toJSON(),
};

describe('Incident Service', () => {
  let service: IncidentService;
  let httpMock: HttpTestingController;
  let expectedResult: IIncident | IIncident[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(IncidentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Incident', () => {
      const incident = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(incident).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Incident', () => {
      const incident = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(incident).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Incident', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Incident', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Incident', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addIncidentToCollectionIfMissing', () => {
      it('should add a Incident to an empty array', () => {
        const incident: IIncident = sampleWithRequiredData;
        expectedResult = service.addIncidentToCollectionIfMissing([], incident);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(incident);
      });

      it('should not add a Incident to an array that contains it', () => {
        const incident: IIncident = sampleWithRequiredData;
        const incidentCollection: IIncident[] = [
          {
            ...incident,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addIncidentToCollectionIfMissing(incidentCollection, incident);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Incident to an array that doesn't contain it", () => {
        const incident: IIncident = sampleWithRequiredData;
        const incidentCollection: IIncident[] = [sampleWithPartialData];
        expectedResult = service.addIncidentToCollectionIfMissing(incidentCollection, incident);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(incident);
      });

      it('should add only unique Incident to an array', () => {
        const incidentArray: IIncident[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const incidentCollection: IIncident[] = [sampleWithRequiredData];
        expectedResult = service.addIncidentToCollectionIfMissing(incidentCollection, ...incidentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const incident: IIncident = sampleWithRequiredData;
        const incident2: IIncident = sampleWithPartialData;
        expectedResult = service.addIncidentToCollectionIfMissing([], incident, incident2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(incident);
        expect(expectedResult).toContain(incident2);
      });

      it('should accept null and undefined values', () => {
        const incident: IIncident = sampleWithRequiredData;
        expectedResult = service.addIncidentToCollectionIfMissing([], null, incident, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(incident);
      });

      it('should return initial array if no Incident is added', () => {
        const incidentCollection: IIncident[] = [sampleWithRequiredData];
        expectedResult = service.addIncidentToCollectionIfMissing(incidentCollection, undefined, null);
        expect(expectedResult).toEqual(incidentCollection);
      });
    });

    describe('compareIncident', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareIncident(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareIncident(entity1, entity2);
        const compareResult2 = service.compareIncident(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareIncident(entity1, entity2);
        const compareResult2 = service.compareIncident(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareIncident(entity1, entity2);
        const compareResult2 = service.compareIncident(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
