import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IncidentDetailComponent } from './incident-detail.component';

describe('Incident Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: IncidentDetailComponent,
              resolve: { incident: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(IncidentDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load incident on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', IncidentDetailComponent);

      // THEN
      expect(instance.incident).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
