import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IncidentService } from '../service/incident.service';

import { IncidentComponent } from './incident.component';

describe('Incident Management Component', () => {
  let comp: IncidentComponent;
  let fixture: ComponentFixture<IncidentComponent>;
  let service: IncidentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'incident', component: IncidentComponent }]),
        HttpClientTestingModule,
        IncidentComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(IncidentComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IncidentComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(IncidentService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.incidents?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to incidentService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getIncidentIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getIncidentIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
