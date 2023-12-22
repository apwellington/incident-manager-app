import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserAppDetailComponent } from './user-app-detail.component';

describe('UserApp Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAppDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: UserAppDetailComponent,
              resolve: { userApp: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(UserAppDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load userApp on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', UserAppDetailComponent);

      // THEN
      expect(instance.userApp).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
