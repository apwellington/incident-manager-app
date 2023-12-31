import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PriorityService } from '../service/priority.service';

import { PriorityComponent } from './priority.component';

describe('Priority Management Component', () => {
  let comp: PriorityComponent;
  let fixture: ComponentFixture<PriorityComponent>;
  let service: PriorityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'priority', component: PriorityComponent }]),
        HttpClientTestingModule,
        PriorityComponent,
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
      .overrideTemplate(PriorityComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PriorityComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PriorityService);

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
    expect(comp.priorities?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to priorityService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPriorityIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPriorityIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
